<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tests\TestCase;

class LoanTest extends TestCase
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
            'email' => 'estudiante.prueba@example.com',
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

    public function test_loan_can_be_registered_and_inventory_decreases(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $this->assertDatabaseHas('loans', [
            'id' => $loan->id,
            'student_id' => $this->student->id,
            'instrument_id' => $this->instrument->id,
        ]);

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'available_units' => 4,
        ]);

        $this->assertTrue(
            $loan->due_at->equalTo($loan->loaned_at->copy()->addDays(21))
        );
    }

    public function test_student_cannot_have_two_pending_loans(): void
    {
        $service = app(LoanService::class);

        $service->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $anotherInstrument = Instrument::create([
            'category_id' => $this->instrument->category_id,
            'code' => 'INS-TEST-002',
            'name' => 'Violin de prueba',
            'total_units' => 3,
            'available_units' => 3,
            'is_active' => true,
        ]);

        $this->expectException(ConflictHttpException::class);

        $service->createLoan(
            $this->student->id,
            $anotherInstrument->id
        );
    }
}
