<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Loan extends Model
{
    protected $fillable = [
        'student_id',
        'instrument_id',
        'student_code',
        'student_name',
        'instrument_code',
        'instrument_name',
        'loaned_at',
        'due_at',
    ];

    protected function casts(): array
    {
        return [
            'loaned_at' => 'datetime',
            'due_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class);
    }

    public function returnRecord(): HasOne
    {
        return $this->hasOne(ReturnRecord::class);
    }
}
