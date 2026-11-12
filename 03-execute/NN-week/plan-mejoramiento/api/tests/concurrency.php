<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Loan;
use App\Models\Student;
use Illuminate\Contracts\Console\Kernel;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';

$app->make(Kernel::class)->bootstrap();

// Prevent tests from modifying the production database.
$database = config('database.connections.mysql.database');

if ($database !== 'music_school_test') {
    throw new RuntimeException(
        'Unsafe database connection: ' . $database
    );
}

// Generate unique identifiers for this test run.
$token = strtoupper(bin2hex(random_bytes(4)));

$category = Category::create([
    'code' => 'CON-' . $token,
    'name' => 'Concurrency Test',
    'is_active' => true,
]);

$instrument = Instrument::create([
    'category_id' => $category->id,
    'code' => 'INS-' . $token,
    'name' => 'Test Guitar',
    'total_units' => 1,
    'available_units' => 1,
    'is_active' => true,
]);

$students = [];

for ($i = 1; $i <= 2; $i++) {
    $students[] = Student::create([
        'student_code' => 'EST-' . $token . '-' . $i,
        'full_name' => 'Concurrency Student ' . $i,
        'email' => strtolower(
            'test-' . $token . '-' . $i . '@example.com'
        ),
    ]);
}

echo "Database: {$database}\n";
echo "Instrument ID: {$instrument->id}\n";
echo "Available units: 1\n\n";

// Launch two independent HTTP requests.
$processes = [];

foreach ($students as $student) {
    $payload = json_encode([
        'student_id' => $student->id,
        'instrument_id' => $instrument->id,
    ], JSON_THROW_ON_ERROR);

    $command = [
        'curl',
        '--silent',
        '--show-error',
        '--max-time',
        '20',
        '--output',
        '/dev/null',
        '--write-out',
        '%{http_code}',
        '--header',
        'Content-Type: application/json',
        '--request',
        'POST',
        '--data',
        $payload,
        'http://127.0.0.1/api/loans',
    ];

    $descriptorSpec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $process = proc_open(
        $command,
        $descriptorSpec,
        $pipes
    );

    if (!is_resource($process)) {
        throw new RuntimeException(
            'Unable to start HTTP request.'
        );
    }

    fclose($pipes[0]);

    $processes[] = [
        'process' => $process,
        'pipes' => $pipes,
    ];
}

// Collect the responses after starting both requests.
$statuses = [];

foreach ($processes as $index => $item) {
    $status = trim(stream_get_contents($item['pipes'][1]));
    $error = trim(stream_get_contents($item['pipes'][2]));

    fclose($item['pipes'][1]);
    fclose($item['pipes'][2]);

    $exitCode = proc_close($item['process']);

    if ($exitCode !== 0) {
        throw new RuntimeException(
            'HTTP request failed: ' . $error
        );
    }

    $statuses[] = (int) $status;

    echo 'Request ' . ($index + 1)
        . ': HTTP ' . $status . "\n";
}

// Verify the final state directly in MySQL.
$loanCount = Loan::query()
    ->where('instrument_id', $instrument->id)
    ->count();

$availableUnits = $instrument
    ->fresh()
    ->available_units;

sort($statuses);

$passed = $statuses === [201, 409]
    && $loanCount === 1
    && (int) $availableUnits === 0;

echo "\n";
echo "Loans created: {$loanCount}\n";
echo "Available units: {$availableUnits}\n";
echo 'Result: ' . ($passed ? 'PASS' : 'FAIL') . "\n";

exit($passed ? 0 : 1);
