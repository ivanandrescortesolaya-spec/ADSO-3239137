<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->orderBy('code')
            ->get(['id', 'code', 'name']);

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

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Categoria registrada correctamente.',
            'data' => $category,
        ], 201);
    }
}
