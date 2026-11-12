<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Instrument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class InstrumentController extends Controller
{
    /**
     * List instruments.
     */
    public function index(): JsonResponse
    {
        $instruments = Instrument::with('category')
            ->orderBy('code')
            ->get();

        return response()->json([
            'data' => $instruments,
        ], 200);
    }

    /**
     * Fetch an instrument.
     */
    public function show(int $id): JsonResponse
    {
        $instrument = Instrument::with('category')->findOrFail($id);

        return response()->json([
            'data' => $instrument,
        ], 200);
    }

    /**
     * Create an instrument.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id'),
            ],
            'code' => [
                'required',
                'string',
                'max:30',
                'unique:instruments,code',
            ],
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'total_units' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        $this->ensureCategoryIsActive($validated['category_id']);

        $instrument = Instrument::create([
            'category_id' => $validated['category_id'],
            'code' => $validated['code'],
            'name' => $validated['name'],
            'total_units' => $validated['total_units'],
            'available_units' => $validated['total_units'],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Instrumento registrado correctamente.',
            'data' => $instrument->load('category'),
        ], 201);
    }

    /**
     * Update an instrument without incorrectly
     * changing the units currently on loan.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id'),
            ],
            'code' => [
                'required',
                'string',
                'max:30',
                'unique:instruments,code,' . $id,
            ],
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'total_units' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        $this->ensureCategoryIsActive($validated['category_id']);

        $instrument = DB::transaction(function () use ($validated, $id) {
            $instrument = Instrument::query()
                ->lockForUpdate()
                ->findOrFail($id);

            // Calculate how many units are on loan.
            $unitsLoaned = $instrument->total_units
                - $instrument->available_units;

            // Do not allow a total lower than the units currently on loan.
            if ($validated['total_units'] < $unitsLoaned) {
                throw new ConflictHttpException(
                    'El total de unidades no puede ser inferior a las unidades actualmente prestadas.'
                );
            }

            $instrument->update([
                'category_id' => $validated['category_id'],
                'code' => $validated['code'],
                'name' => $validated['name'],
                'total_units' => $validated['total_units'],
                'available_units' => $validated['total_units'] - $unitsLoaned,
            ]);

            return $instrument;
        });

        return response()->json([
            'message' => 'Instrumento actualizado correctamente.',
            'data' => $instrument->load('category'),
        ], 200);
    }

    /**
     * Deactivate an instrument without physically deleting it.
     */
    public function deactivate(int $id): JsonResponse
    {
        $instrument = Instrument::findOrFail($id);

        if (!$instrument->is_active) {
            throw new ConflictHttpException(
                'El instrumento ya se encuentra inactivo.'
            );
        }

        $instrument->update([
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Instrumento desactivado correctamente.',
            'data' => $instrument,
        ], 200);
    }

    private function ensureCategoryIsActive(int $categoryId): void
    {
        $category = Category::findOrFail($categoryId);

        if (!$category->is_active) {
            throw ValidationException::withMessages([
                'category_id' => 'No se puede registrar un instrumento en una categoria inactiva',
            ]);
        }
    }
}
