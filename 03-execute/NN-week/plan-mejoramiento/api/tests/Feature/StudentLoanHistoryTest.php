<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use App\Services\ReturnService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentLoanHistoryTest extends TestCase
{
    use RefreshDatabase;

    private Student $student;
    private Instrument $firstInstrument;
    private Instrument $secondInstrument;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create([
            'code' => 'CAT-TEST',
            'name' => 'Categoria de prueba',
        ]);

        $this->student = Student::create([
            'student_code' => 'EST-TEST-001',
            'full_name' => 'Estudiante de prueba',
            'email' => 'estudiante@example.com',
        ]);

        $this->firstInstrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-TEST-001',
            'name' => 'Guitarra de prueba',
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);

        $this->secondInstrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-TEST-002',
            'name' => 'Violin de prueba',
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);
    }

    public function test_student_loan_history_returns_its_loans(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->firstInstrument->id
        );

        $response = $this->getJson(
            '/api/students/' . $this->student->id . '/loans'
        );

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $loan->id,
            'instrument_code' => 'INS-TEST-001',
        ]);
    }

    public function test_student_history_includes_previous_returned_loans(): void
    {
        $loanService = app(LoanService::class);
        $returnService = app(ReturnService::class);

        // Primer prestamo.
        $firstLoan = $loanService->createLoan(
            $this->student->id,
            $this->firstInstrument->id
        );

        // Devolver el primer instrumento.
        $returnService->createReturn($firstLoan->id);

        // Segundo prestamo del mismo estudiante.
        $secondLoan = $loanService->createLoan(
            $this->student->id,
            $this->secondInstrument->id
        );

        $response = $this->getJson(
            '/api/students/' . $this->student->id . '/loans'
        );

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $firstLoan->id,
        ]);

        $response->assertJsonFragment([
            'id' => $secondLoan->id,
        ]);

        $response->assertJsonCount(2, 'data');
    }

    public function test_nonexistent_student_loan_history_returns_404(): void
    {
        $response = $this->getJson('/api/students/99999/loans');

        $response->assertNotFound();
    }
}
