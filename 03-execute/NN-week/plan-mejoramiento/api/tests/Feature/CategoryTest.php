<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            'name' => 'Categoría de prueba',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('categories', [
            'code' => 'CAT-TEST',
            'name' => 'Categoría de prueba',
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
            'name' => 'Otra categoría',
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
