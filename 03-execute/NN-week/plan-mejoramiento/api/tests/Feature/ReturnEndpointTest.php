<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReturnEndpointTest extends TestCase
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

    public function test_return_can_be_registered_through_api(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $response = $this->postJson(
            '/api/loans/' . $loan->id . '/returns',
            []
        );

        $response->assertCreated();

        $this->assertDatabaseHas('returns', [
            'loan_id' => $loan->id,
        ]);

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'available_units' => 5,
        ]);
    }

    public function test_return_remains_available_for_a_loan_when_its_category_is_inactive(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $this->instrument->category->update(['is_active' => false]);

        $response = $this->postJson(
            '/api/loans/' . $loan->id . '/returns',
            []
        );

        $response->assertCreated();

        $this->assertDatabaseHas('loans', [
            'id' => $loan->id,
            'instrument_id' => $this->instrument->id,
            'student_id' => $this->student->id,
        ]);
        $this->assertDatabaseHas('returns', [
            'loan_id' => $loan->id,
        ]);
    }

    public function test_duplicate_return_through_api_returns_409(): void
    {
        $loan = app(LoanService::class)->createLoan(
            $this->student->id,
            $this->instrument->id
        );

        $url = '/api/loans/' . $loan->id . '/returns';

        $this->postJson($url, [])->assertCreated();

        $response = $this->postJson($url, []);

        $response->assertStatus(409);
    }

    public function test_return_of_nonexistent_loan_returns_404(): void
    {
        $response = $this->postJson(
            '/api/loans/99999/returns',
            []
        );

        $response->assertNotFound();
    }
}
