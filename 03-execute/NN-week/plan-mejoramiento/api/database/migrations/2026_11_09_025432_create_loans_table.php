<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->restrictOnDelete();

            $table->foreignId('instrument_id')
                ->constrained('instruments')
                ->restrictOnDelete();

            // Datos históricos del estudiante y del instrumento.
            $table->string('student_code', 30);
            $table->string('student_name', 150);
            $table->string('instrument_code', 30);
            $table->string('instrument_name', 150);

            $table->dateTime('loaned_at');
            $table->dateTime('due_at');

            $table->timestamps();

            $table->index(['student_id', 'due_at']);
            $table->index(['instrument_id', 'loaned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};