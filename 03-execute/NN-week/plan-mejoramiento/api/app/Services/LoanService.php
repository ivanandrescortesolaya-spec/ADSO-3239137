<?php

namespace App\Services;

use App\Models\Instrument;
use App\Models\Loan;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class LoanService
{
    public function createLoan(int $studentId, int $instrumentId): Loan
    {
        return DB::transaction(function () use ($studentId, $instrumentId) {

            // Bloquear al estudiante.
            $student = Student::query()
                ->lockForUpdate()
                ->findOrFail($studentId);

            // Bloquear el instrumento.
            $instrument = Instrument::query()
                ->lockForUpdate()
                ->findOrFail($instrumentId);

            // Verificar que el instrumento este activo.
            if (!$instrument->is_active) {
                throw new ConflictHttpException(
                    'El instrumento no esta disponible para prestamos.'
                );
            }

            if (!$instrument->category()->where('is_active', true)->exists()) {
                throw ValidationException::withMessages([
                    'instrument_id' => 'No se puede prestar un instrumento de una categoria inactiva',
                ]);
            }

            // Verificar prestamos pendientes o vencidos.
            $hasPendingLoan = Loan::query()
                ->where('student_id', $student->id)
                ->whereDoesntHave('returnRecord')
                ->exists();

            if ($hasPendingLoan) {
                throw new ConflictHttpException(
                    'El estudiante tiene un prestamo pendiente de devolucion.'
                );
            }

            // Verificar disponibilidad despues del bloqueo.
            if ($instrument->available_units <= 0) {
                throw new ConflictHttpException(
                    'No hay unidades disponibles de este instrumento.'
                );
            }

            // Registrar fechas UTC.
            $loanedAt = now('UTC');

            $loan = Loan::create([
                'student_id' => $student->id,
                'instrument_id' => $instrument->id,
                'student_code' => $student->student_code,
                'student_name' => $student->full_name,
                'instrument_code' => $instrument->code,
                'instrument_name' => $instrument->name,
                'loaned_at' => $loanedAt,
                'due_at' => $loanedAt->copy()->addDays(21),
            ]);

            // Descontar una unidad disponible.
            $instrument->decrement('available_units');

            return $loan;
        });
    }
}
