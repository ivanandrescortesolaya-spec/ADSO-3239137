<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use App\Services\LoanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanSnapshotTest extends TestCase
{
    use RefreshDatabase;

    public function test_loan_preserves_student_and_instrument_data_when_catalog_changes(): void
    {
        $category = Category::create([
            'code' => 'CAT-SNAP',
            'name' => 'Categoria de prueba',
        ]);

        $student = Student::create([
            'student_code' => 'EST-SNAP-001',
            'full_name' => 'Nombre original',
            'email' => 'original@example.com',
        ]);

        $instrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-SNAP-001',
            'name' => 'Guitarra original',
            'total_units' => 2,
            'available_units' => 2,
            'is_active' => true,
        ]);

        $loan = app(LoanService::class)->createLoan(
            $student->id,
            $instrument->id
        );

        $student->update([
            'full_name' => 'Nombre actualizado',
        ]);

        $instrument->update([
            'name' => 'Guitarra actualizada',
            'code' => 'INS-SNAP-002',
        ]);

        $this->assertDatabaseHas('loans', [
            'id' => $loan->id,
            'student_name' => 'Nombre original',
            'instrument_name' => 'Guitarra original',
            'instrument_code' => 'INS-SNAP-001',
        ]);
    }
}
