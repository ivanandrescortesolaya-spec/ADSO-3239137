<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'is_active']);

        return response()->json([
            'data' => $categories,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:20',
                'unique:categories,code',
            ],
            'name' => [
                'required',
                'string',
                'max:100',
            ],
        ]);

        $category = Category::create([...$validated, 'is_active' => true]);

        return response()->json([
            'message' => 'Categoria registrada correctamente.',
            'data' => $category,
        ], 201);
    }

    public function deactivate(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        if (!$category->is_active) {
            throw new ConflictHttpException('La categoria ya se encuentra inactiva.');
        }

        $hasPendingLoans = $category->instruments()
            ->whereHas('loans', function ($query) {
                $query->whereDoesntHave('returnRecord');
            })
            ->exists();

        if ($hasPendingLoans) {
            throw new ConflictHttpException(
                'No se puede desactivar esta categoria porque tiene instrumentos con prestamos pendientes de devolucion'
            );
        }

        $category->update(['is_active' => false]);

        return response()->json([
            'message' => 'Categoria desactivada correctamente.',
            'data' => $category,
        ], 200);
    }

    public function activate(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        if ($category->is_active) {
            throw new ConflictHttpException('La categoria ya se encuentra activa.');
        }

        $category->update(['is_active' => true]);

        return response()->json([
            'message' => 'Categoria activada correctamente.',
            'data' => $category,
        ], 200);
    }
}
