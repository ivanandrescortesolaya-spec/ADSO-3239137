<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanQueryTest extends TestCase
{
    use RefreshDatabase;

    private Student $student;
    private Instrument $instrument;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create([
            'code' => 'CAT-TEST',
            'name' => 'Categoría de prueba',
        ]);

        $this->student = Student::create([
            'student_code' => 'EST-TEST-001',
            'full_name' => 'Estudiante de prueba',
            'email' => 'estudiante@example.com',
        ]);

        $this->instrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-TEST-001',
            'name' => 'Guitarra de prueba',
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);
    }

    public function test_loans_can_be_listed(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $response = $this->getJson('/api/loans');

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $loan->id,
            'instrument_code' => 'INS-TEST-001',
        ]);
    }

    public function test_loan_can_be_consulted_by_id(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $response = $this->getJson('/api/loans/' . $loan->id);

        $response->assertOk();

        $response->assertJsonPath(
            'data.id',
            $loan->id
        );

        $response->assertJsonPath(
            'data.student_code',
            'EST-TEST-001'
        );
    }

    public function test_nonexistent_loan_returns_404(): void
    {
        $response = $this->getJson('/api/loans/99999');

        $response->assertNotFound();
    }
}

