<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instrument extends Model
{
    protected $fillable = [
        'category_id',
        'code',
        'name',
        'total_units',
        'available_units',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'total_units' => 'integer',
            'available_units' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}
