<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use App\Services\ReturnService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OverdueLoanTest extends TestCase
{
    use RefreshDatabase;

    private Category $category;
    private Instrument $instrument;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = Category::create([
            'code' => 'CAT-TEST',
            'name' => 'Categoría de prueba',
        ]);

        $this->instrument = Instrument::create([
            'category_id' => $this->category->id,
            'code' => 'INS-TEST-001',
            'name' => 'Guitarra de prueba',
            'total_units' => 10,
            'available_units' => 10,
            'is_active' => true,
        ]);
    }

    private function createStudent(string $code): Student
    {
        return Student::create([
            'student_code' => $code,
            'full_name' => 'Estudiante de prueba',
            'email' => strtolower($code) . '@example.com',
        ]);
    }

    public function test_overdue_endpoint_returns_unreturned_overdue_loans(): void
    {
        $student = $this->createStudent('EST-TEST-001');

        $loan = app(LoanService::class)->createLoan(
            $student->id,
            $this->instrument->id
        );

        // Convertir el préstamo en vencido para la prueba.
        $loan->update([
            'due_at' => now('UTC')->subDay(),
        ]);

        $response = $this->getJson('/api/loans/overdue');

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $loan->id,
            'student_code' => $student->student_code,
        ]);
    }

    public function test_returned_overdue_loan_is_not_in_overdue_list(): void
    {
        $student = $this->createStudent('EST-TEST-002');

        $loan = app(LoanService::class)->createLoan(
            $student->id,
            $this->instrument->id
        );

        $loan->update([
            'due_at' => now('UTC')->subDay(),
        ]);

        // Registrar la devolución.
        app(ReturnService::class)->createReturn($loan->id);

        $response = $this->getJson('/api/loans/overdue');

        $response->assertOk();

        $response->assertJsonMissing([
            'id' => $loan->id,
        ]);
    }

    public function test_future_loan_is_not_considered_overdue(): void
    {
        $student = $this->createStudent('EST-TEST-003');

        $loan = app(LoanService::class)->createLoan(
            $student->id,
            $this->instrument->id
        );

        $response = $this->getJson('/api/loans/overdue');

        $response->assertOk();

        $response->assertJsonMissing([
            'id' => $loan->id,
        ]);
    }
}
