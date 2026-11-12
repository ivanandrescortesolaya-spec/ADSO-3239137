<?php

namespace App\Services;

use App\Models\Instrument;
use App\Models\Loan;
use App\Models\ReturnRecord;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ReturnService
{
    public function createReturn(int $loanId): ReturnRecord
    {
        return DB::transaction(function () use ($loanId) {

            // Lock the loan.
            $loan = Loan::query()
                ->lockForUpdate()
                ->findOrFail($loanId);

            // Check that the loan has not been returned.
            if ($loan->returnRecord()->exists()) {
                throw new ConflictHttpException(
                    'Este prestamo ya tiene registrada una devolucion.'
                );
            }

            // Lock the associated instrument.
            $instrument = Instrument::query()
                ->lockForUpdate()
                ->findOrFail($loan->instrument_id);

            // Record the return in UTC.
            $returnRecord = ReturnRecord::create([
                'loan_id' => $loan->id,
                'returned_at' => now('UTC'),
            ]);

            // Restore one unit to the inventory.
            if ($instrument->available_units >= $instrument->total_units) {
                throw new ConflictHttpException(
                    'No es posible devolver esta unidad porque el inventario alcanzaria un valor invalido.'
                );
            }

            $instrument->increment('available_units');

            return $returnRecord;
        });
    }
}
