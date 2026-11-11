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

            // Bloquear el prestamo.
            $loan = Loan::query()
                ->lockForUpdate()
                ->findOrFail($loanId);

            // Comprobar que el prestamo no haya sido devuelto.
            if ($loan->returnRecord()->exists()) {
                throw new ConflictHttpException(
                    'Este prestamo ya tiene registrada una devolucion.'
                );
            }

            // Bloquear el instrumento asociado.
            $instrument = Instrument::query()
                ->lockForUpdate()
                ->findOrFail($loan->instrument_id);

            // Registrar la devolucion en UTC.
            $returnRecord = ReturnRecord::create([
                'loan_id' => $loan->id,
                'returned_at' => now('UTC'),
            ]);

            // Recuperar una unidad del inventario.
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
