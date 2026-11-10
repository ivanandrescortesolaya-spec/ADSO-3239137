<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Reporte de instrumentos más solicitados.
     */
    public function mostRequestedInstruments(): JsonResponse
    {
        $report = Loan::query()
            ->select([
                'instrument_id',
                'instrument_code',
                'instrument_name',
                DB::raw('COUNT(*) as total_loans'),
            ])
            ->groupBy(
                'instrument_id',
                'instrument_code',
                'instrument_name'
            )
            ->orderByDesc('total_loans')
            ->orderBy('instrument_name')
            ->get();

        return response()->json([
            'data' => $report,
        ], 200);
    }
}
