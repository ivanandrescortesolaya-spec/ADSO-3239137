<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Instrument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class InstrumentController extends Controller
{
    /**
     * Listar instrumentos.
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
     * Consultar un instrumento.
     */
    public function show(int $id): JsonResponse
    {
        $instrument = Instrument::with('category')->findOrFail($id);

        return response()->json([
            'data' => $instrument,
        ], 200);
    }

    /**
     * Registrar un instrumento.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
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
     * Actualizar un instrumento sin alterar
     * incorrectamente las unidades prestadas.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
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

        $instrument = DB::transaction(function () use ($validated, $id) {
            $instrument = Instrument::query()
                ->lockForUpdate()
                ->findOrFail($id);

            // Calcular cuántas unidades están prestadas.
            $unitsLoaned = $instrument->total_units
                - $instrument->available_units;

            // No permitir un total inferior a las unidades prestadas.
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
     * Dar de baja un instrumento sin eliminarlo físicamente.
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
}