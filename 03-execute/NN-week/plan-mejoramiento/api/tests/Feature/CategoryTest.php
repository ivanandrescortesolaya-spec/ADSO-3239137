<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\LoanService;
use App\Services\ReturnService;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_can_be_listed(): void
    {
        Category::create([
            'code' => 'CAT-02',
            'name' => 'Vientos',
        ]);

        Category::create([
            'code' => 'CAT-01',
            'name' => 'Cuerdas',
        ]);

        $response = $this->getJson('/api/categories');

        $response->assertOk();

        $response->assertJsonPath('data.0.code', 'CAT-01');
        $response->assertJsonPath('data.1.code', 'CAT-02');
    }

    public function test_category_can_be_registered(): void
    {
        $response = $this->postJson('/api/categories', [
            'code' => 'CAT-TEST',
            'name' => 'Categoria de prueba',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('categories', [
            'code' => 'CAT-TEST',
            'name' => 'Categoria de prueba',
            'is_active' => true,
        ]);
    }

    public function test_category_can_be_deactivated_and_reactivated_without_changing_its_instruments(): void
    {
        $category = Category::create([
            'code' => 'CAT-01',
            'name' => 'Cuerdas',
        ]);

        $instrument = $this->postJson('/api/instruments', [
            'category_id' => $category->id,
            'code' => 'INS-01',
            'name' => 'Guitarra',
            'total_units' => 3,
        ])->assertCreated()->json('data');

        $this->patchJson("/api/categories/{$category->id}/deactivate")
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonFragment(['id' => $category->id, 'is_active' => false]);

        $this->postJson('/api/instruments', [
            'category_id' => $category->id,
            'code' => 'INS-02',
            'name' => 'Ukelele',
            'total_units' => 1,
        ])->assertUnprocessable()->assertJsonValidationErrors('category_id');

        $this->assertDatabaseHas('instruments', [
            'id' => $instrument['id'],
            'category_id' => $category->id,
        ]);

        $this->patchJson("/api/categories/{$category->id}/activate")
            ->assertOk()
            ->assertJsonPath('data.is_active', true);

        $this->postJson('/api/instruments', [
            'category_id' => $category->id,
            'code' => 'INS-03',
            'name' => 'Ukelele',
            'total_units' => 1,
        ])->assertCreated();
    }

    public function test_category_status_endpoints_return_not_found_for_unknown_category(): void
    {
        $this->patchJson('/api/categories/999/deactivate')->assertNotFound();
        $this->patchJson('/api/categories/999/activate')->assertNotFound();
    }

    public function test_category_with_instruments_and_no_loans_can_be_deactivated(): void
    {
        [$category] = $this->createCategoryWithInstrument();

        $this->patchJson("/api/categories/{$category->id}/deactivate")
            ->assertOk()
            ->assertJsonPath('data.is_active', false);
    }

    public function test_category_with_a_pending_loan_cannot_be_deactivated(): void
    {
        [$category, $instrument] = $this->createCategoryWithInstrument();
        $student = $this->createStudent();
        $loan = app(LoanService::class)->createLoan($student->id, $instrument->id);

        $this->patchJson("/api/categories/{$category->id}/deactivate")
            ->assertStatus(409)
            ->assertJsonPath(
                'message',
                'No se puede desactivar esta categoria porque tiene instrumentos con prestamos pendientes de devolucion'
            );

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('loans', ['id' => $loan->id]);
        $this->assertDatabaseMissing('returns', ['loan_id' => $loan->id]);
    }

    public function test_category_with_returned_loans_can_be_deactivated(): void
    {
        [$category, $instrument] = $this->createCategoryWithInstrument();
        $student = $this->createStudent();
        $loan = app(LoanService::class)->createLoan($student->id, $instrument->id);
        $returnRecord = app(ReturnService::class)->createReturn($loan->id);

        $this->patchJson("/api/categories/{$category->id}/deactivate")
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('loans', ['id' => $loan->id]);
        $this->assertDatabaseHas('returns', ['id' => $returnRecord->id, 'loan_id' => $loan->id]);
    }

    public function test_category_without_instruments_can_be_deactivated(): void
    {
        $category = Category::create([
            'code' => 'CAT-EMPTY',
            'name' => 'Categoria vacia',
        ]);

        $this->patchJson("/api/categories/{$category->id}/deactivate")
            ->assertOk()
            ->assertJsonPath('data.is_active', false);
    }

    private function createCategoryWithInstrument(): array
    {
        $category = Category::create([
            'code' => 'CAT-' . uniqid(),
            'name' => 'Categoria de prueba',
        ]);

        $instrument = Instrument::create([
            'category_id' => $category->id,
            'code' => 'INS-' . uniqid(),
            'name' => 'Instrumento de prueba',
            'total_units' => 1,
            'available_units' => 1,
            'is_active' => true,
        ]);

        return [$category, $instrument];
    }

    private function createStudent(): Student
    {
        return Student::create([
            'student_code' => 'EST-' . uniqid(),
            'full_name' => 'Estudiante de prueba',
            'email' => uniqid() . '@example.com',
        ]);
    }

    public function test_category_code_must_be_unique(): void
    {
        Category::create([
            'code' => 'CAT-01',
            'name' => 'Cuerdas',
        ]);

        $response = $this->postJson('/api/categories', [
            'code' => 'CAT-01',
            'name' => 'Otra categoria',
        ]);

        $response->assertUnprocessable();
    }

    public function test_category_requires_code_and_name(): void
    {
        $response = $this->postJson('/api/categories', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors([
            'code',
            'name',
        ]);
    }
}
