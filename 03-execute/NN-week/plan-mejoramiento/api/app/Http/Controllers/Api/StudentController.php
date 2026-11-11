<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Listar estudiantes.
     */
    public function index(): JsonResponse
    {
        $students = Student::query()
            ->orderBy('student_code')
            ->get();

        return response()->json([
            'data' => $students,
        ], 200);
    }

    /**
     * Consultar un estudiante.
     */
    public function show(int $id): JsonResponse
    {
        $student = Student::with('loans.returnRecord')
            ->findOrFail($id);

        return response()->json([
            'data' => $student,
        ], 200);
    }

    /**
     * Consultar los prestamos de un estudiante.
     */
    public function loans(int $id): JsonResponse
    {
        $student = Student::findOrFail($id);

        $loans = $student->loans()
            ->with([
                'student',
                'instrument',
                'returnRecord',
            ])
            ->orderByDesc('loaned_at')
            ->get();

        return response()->json([
            'data' => $loans,
        ], 200);
    }

    /**
     * Registrar un estudiante.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_code' => [
                'required',
                'string',
                'max:30',
                'unique:students,student_code',
            ],
            'full_name' => [
                'required',
                'string',
                'max:150',
            ],
            'email' => [
                'required',
                'email',
                'max:150',
                'unique:students,email',
            ],
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Estudiante registrado correctamente.',
            'data' => $student,
        ], 201);
    }

    /**
     * Actualizar informacion del estudiante.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_code' => [
                'required',
                'string',
                'max:30',
                'unique:students,student_code,' . $id,
            ],
            'full_name' => [
                'required',
                'string',
                'max:150',
            ],
            'email' => [
                'required',
                'email',
                'max:150',
                'unique:students,email,' . $id,
            ],
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Estudiante actualizado correctamente.',
            'data' => $student,
        ], 200);
    }
}
