<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use App\Services\ReturnService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Tests\TestCase;

class ReturnTest extends TestCase
{
    use RefreshDatabase;

    private Student $student;
    private Instrument $instrument;

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

    public function test_instrument_can_be_returned_and_inventory_increases(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $returnRecord = app(ReturnService::class)->createReturn($loan->id);

        $this->assertDatabaseHas('returns', [
            'id' => $returnRecord->id,
            'loan_id' => $loan->id,
        ]);

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'available_units' => 5,
        ]);
    }

    public function test_loan_cannot_be_returned_twice(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $service = app(ReturnService::class);

        $service->createReturn($loan->id);

        $this->expectException(ConflictHttpException::class);

        $service->createReturn($loan->id);
    }
}
