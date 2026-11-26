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
            'student_code' => 'EST-SNAP-001',
            'student_name' => 'Nombre original',
            'instrument_name' => 'Guitarra original',
            'instrument_code' => 'INS-SNAP-001',
        ]);
    }

    public function test_loan_preserves_all_snapshots_after_student_and_instrument_api_updates(): void
    {
        $category = Category::create([
            'code' => 'CAT-SNAP-API',
            'name' => 'Snapshot API category',
        ]);

        $student = Student::create([
            'student_code' => 'EST-SNAP-API-001',
            'full_name' => 'Original Student',
            'email' => 'original.api@example.com',
        ]);

        $instrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-SNAP-API-001',
            'name' => 'Original Instrument',
            'total_units' => 2,
            'available_units' => 2,
            'is_active' => true,
        ]);

        $loanResponse = $this->postJson('/api/loans', [
            'student_id' => $student->id,
            'instrument_id' => $instrument->id,
        ]);
        $loanResponse->assertCreated();
        $loanId = $loanResponse->json('data.id');

        $studentUpdateResponse = $this->putJson('/api/students/' . $student->id, [
            'student_code' => 'EST-SNAP-API-002',
            'full_name' => 'Updated Student',
            'email' => 'updated.api@example.com',
        ]);
        $studentUpdateResponse->assertOk();
        $studentUpdateResponse->assertJsonPath('data.student_code', 'EST-SNAP-API-002');
        $studentUpdateResponse->assertJsonPath('data.full_name', 'Updated Student');
        $studentUpdateResponse->assertJsonPath('data.email', 'updated.api@example.com');

        $instrumentUpdateResponse = $this->putJson('/api/instruments/' . $instrument->id, [
            'category_id' => $category->id,
            'code' => 'INS-SNAP-API-002',
            'name' => 'Updated Instrument',
            'total_units' => 3,
        ]);
        $instrumentUpdateResponse->assertOk();
        $instrumentUpdateResponse->assertJsonPath('data.code', 'INS-SNAP-API-002');
        $instrumentUpdateResponse->assertJsonPath('data.name', 'Updated Instrument');
        $instrumentUpdateResponse->assertJsonPath('data.total_units', 3);

        $this->assertDatabaseHas('loans', [
            'id' => $loanId,
            'student_code' => 'EST-SNAP-API-001',
            'student_name' => 'Original Student',
            'instrument_code' => 'INS-SNAP-API-001',
            'instrument_name' => 'Original Instrument',
        ]);
    }
}
