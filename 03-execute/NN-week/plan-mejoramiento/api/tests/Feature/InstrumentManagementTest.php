<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Instrument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstrumentManagementTest extends TestCase
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
            'total_units' => 5,
            'available_units' => 4,
            'is_active' => true,
        ]);
    }

    public function test_instrument_can_be_consulted_by_id(): void
    {
        $response = $this->getJson(
            '/api/instruments/' . $this->instrument->id
        );

        $response->assertOk();

        $response->assertJsonPath(
            'data.code',
            'INS-TEST-001'
        );
    }

    public function test_instrument_can_be_updated(): void
    {
        $response = $this->putJson(
            '/api/instruments/' . $this->instrument->id,
            [
                'category_id' => $this->category->id,
                'code' => 'INS-TEST-001',
                'name' => 'Guitarra actualizada',
                'total_units' => 5,
            ]
        );

        $response->assertOk();

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'name' => 'Guitarra actualizada',
            'total_units' => 5,
            'available_units' => 4,
        ]);
    }

    public function test_increasing_total_units_preserves_units_on_loan(): void
    {
        $response = $this->putJson(
            '/api/instruments/' . $this->instrument->id,
            [
                'category_id' => $this->category->id,
                'code' => 'INS-TEST-001',
                'name' => 'Guitarra de prueba',
                'total_units' => 8,
            ]
        );

        $response->assertOk();

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'total_units' => 8,
            'available_units' => 7,
        ]);
    }

    public function test_instrument_can_be_deactivated_without_deleting_it(): void
    {
        $response = $this->patchJson(
            '/api/instruments/' . $this->instrument->id . '/deactivate'
        );

        $response->assertOk();

        $this->assertDatabaseHas('instruments', [
            'id' => $this->instrument->id,
            'is_active' => false,
        ]);
    }

    public function test_inactive_instrument_cannot_be_deactivated_twice(): void
    {
        $this->instrument->update([
            'is_active' => false,
        ]);

        $response = $this->patchJson(
            '/api/instruments/' . $this->instrument->id . '/deactivate'
        );

        $response->assertStatus(409);
    }

    public function test_nonexistent_instrument_returns_404(): void
    {
        $response = $this->getJson('/api/instruments/99999');

        $response->assertNotFound();
    }
}
