<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Loan;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_most_requested_instruments_report_is_ordered_by_loans(): void
    {
        $category = Category::create([
            'code' => 'CAT-TEST',
            'name' => 'Categoria de prueba',
        ]);

        $student = Student::create([
            'student_code' => 'EST-TEST-001',
            'full_name' => 'Estudiante de prueba',
            'email' => 'estudiante@example.com',
        ]);

        $guitar = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-001',
            'name' => 'Guitarra',
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);

        $violin = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-002',
            'name' => 'Violin',
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);

        // Registrar tres prestamos de guitarra.
        for ($i = 0; $i < 3; $i++) {
            Loan::create([
                'student_id' => $student->id,
                'instrument_id' => $guitar->id,
                'student_code' => $student->student_code,
                'student_name' => $student->full_name,
                'instrument_code' => $guitar->code,
                'instrument_name' => $guitar->name,
                'loaned_at' => now('UTC')->subDays($i),
                'due_at' => now('UTC')->addDays(21),
            ]);
        }

        // Registrar un prestamo de violin.
        Loan::create([
            'student_id' => $student->id,
            'instrument_id' => $violin->id,
            'student_code' => $student->student_code,
            'student_name' => $student->full_name,
            'instrument_code' => $violin->code,
            'instrument_name' => $violin->name,
            'loaned_at' => now('UTC'),
            'due_at' => now('UTC')->addDays(21),
        ]);

        $response = $this->getJson(
            '/api/reports/most-requested-instruments'
        );

        $response->assertOk();

        $response->assertJsonPath(
            'data.0.instrument_code',
            'INS-001'
        );

        $response->assertJsonPath(
            'data.0.total_loans',
            3
        );

        $response->assertJsonPath(
            'data.1.instrument_code',
            'INS-002'
        );

        $response->assertJsonPath(
            'data.1.total_loans',
            1
        );
    }

    public function test_report_returns_empty_data_without_loans(): void
    {
        $response = $this->getJson(
            '/api/reports/most-requested-instruments'
        );

        $response->assertOk();
        $response->assertExactJson([
            'data' => [],
        ]);
    }
}
