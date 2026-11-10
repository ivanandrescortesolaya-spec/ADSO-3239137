<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index(): JsonResponse
    {
        $loans = Loan::with([
            'student',
            'instrument',
            'returnRecord',
        ])->latest()->get();

        return response()->json([
            'data' => $loans,
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $loan = Loan::with([
            'student',
            'instrument',
            'returnRecord',
        ])->findOrFail($id);

        return response()->json([
            'data' => $loan,
        ], 200);
    }

    public function store(
        Request $request,
        LoanService $loanService
    ): JsonResponse {
        $validated = $request->validate([
            'student_id' => [
                'required',
                'integer',
                'exists:students,id',
            ],
            'instrument_id' => [
                'required',
                'integer',
                'exists:instruments,id',
            ],
        ]);

        $loan = $loanService->createLoan(
            $validated['student_id'],
            $validated['instrument_id']
        );

        return response()->json([
            'message' => 'Préstamo registrado correctamente.',
            'data' => $loan->load([
                'student',
                'instrument',
                'returnRecord',
            ]),
        ], 201);
    }

    /**
     * Consultar préstamos vencidos que no tienen devolución.
     */
    public function overdue(): JsonResponse
    {
        $loans = Loan::with([
            'student',
            'instrument',
            'returnRecord',
        ])
            ->where('due_at', '<', now('UTC'))
            ->whereDoesntHave('returnRecord')
            ->orderBy('due_at')
            ->get();

        return response()->json([
            'data' => $loans,
        ], 200);
    }
}
