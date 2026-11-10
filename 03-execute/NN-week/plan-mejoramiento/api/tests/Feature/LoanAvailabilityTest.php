<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_loan_returns_409_when_instrument_has_no_available_units(): void
    {
        $category = Category::create([
            'code' => 'CAT-AVAIL',
            'name' => 'Categoria de disponibilidad',
        ]);

        $student = Student::create([
            'student_code' => 'EST-AVAIL-001',
            'full_name' => 'Estudiante disponibilidad',
            'email' => 'disponibilidad@example.com',
        ]);

        $instrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-AVAIL-001',
            'name' => 'Guitarra sin unidades',
            'total_units' => 1,
            'available_units' => 0,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/loans', [
            'student_id' => $student->id,
            'instrument_id' => $instrument->id,
        ]);

        $response->assertStatus(409);

        $response->assertJson([
            'message' => 'No hay unidades disponibles de este instrumento.',
        ]);

        $this->assertDatabaseCount('loans', 0);

        $this->assertDatabaseHas('instruments', [
            'id' => $instrument->id,
            'available_units' => 0,
        ]);
    }
}
