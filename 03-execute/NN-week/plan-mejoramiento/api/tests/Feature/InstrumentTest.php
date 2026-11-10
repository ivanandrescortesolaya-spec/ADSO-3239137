<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Loan;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstrumentTest extends TestCase
{
    use RefreshDatabase;

    private Category $category;
    private Instrument $instrument;
    private Student $student;

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
            'total_units' => 5,
            'available_units' => 5,
            'is_active' => true,
        ]);

        $this->student = Student::create([
            'student_code' => 'EST-TEST-001',
            'full_name' => 'Estudiante de prueba',
            'email' => 'estudiante.prueba@example.com',
        ]);
    }

    public function test_instruments_can_be_listed(): void
    {
        $response = $this->getJson('/api/instruments');

        $response->assertOk();
        $response->assertJsonFragment([
            'code' => 'INS-TEST-001',
        ]);
    }

    public function test_instrument_can_be_registered(): void
    {
        $response = $this->postJson('/api/instruments', [
            'category_id' => $this->category->id,
            'code' => 'INS-TEST-002',
            'name' => 'Violin de prueba',
            'total_units' => 4,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('instruments', [
            'code' => 'INS-TEST-002',
            'total_units' => 4,
            'available_units' => 4,
        ]);
    }

    public function test_inventory_cannot_be_reduced_below_units_on_loan(): void
    {
        $this->instrument->update([
            'available_units' => 4,
        ]);

        Loan::create([
            'student_id' => $this->student->id,
            'instrument_id' => $this->instrument->id,
            'student_code' => $this->student->student_code,
            'student_name' => $this->student->full_name,
            'instrument_code' => $this->instrument->code,
            'instrument_name' => $this->instrument->name,
            'loaned_at' => now('UTC'),
            'due_at' => now('UTC')->addDays(21),
        ]);

        $response = $this->putJson(
            '/api/instruments/' . $this->instrument->id,
            [
                'category_id' => $this->category->id,
                'code' => $this->instrument->code,
                'name' => $this->instrument->name,
                'total_units' => 0,
            ]
        );

        $response->assertStatus(409);

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'total_units' => 5,
            'available_units' => 4,
        ]);
    }
}
