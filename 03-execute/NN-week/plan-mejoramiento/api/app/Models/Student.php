<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'student_code',
        'full_name',
        'email',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}
