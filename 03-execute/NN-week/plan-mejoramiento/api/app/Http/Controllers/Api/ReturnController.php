<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Services\ReturnService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function store(
        Request $request,
        int $loanId,
        ReturnService $returnService
    ): JsonResponse {
        $request->validate([
            'loan_id' => [
                'sometimes',
                'integer',
                'in:' . $loanId,
            ],
        ]);

        $loan = Loan::findOrFail($loanId);

        $returnRecord = $returnService->createReturn($loan->id);

        return response()->json([
            'message' => 'Devolucion registrada correctamente.',
            'data' => $returnRecord->load('loan'),
        ], 201);
    }
}
