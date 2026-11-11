<?php

use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\InstrumentController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\ReturnController;

// Categorias
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
// Instrumentos
Route::get('/instruments', [InstrumentController::class, 'index']);
Route::get('/instruments/{id}', [InstrumentController::class, 'show']);
Route::post('/instruments', [InstrumentController::class, 'store']);
Route::put('/instruments/{id}', [InstrumentController::class, 'update']);
Route::patch('/instruments/{id}/deactivate', [InstrumentController::class, 'deactivate']);
// Estudiantes
Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);

// Prestamos
Route::get('/loans', [LoanController::class, 'index']);
Route::get('/loans/overdue', [LoanController::class, 'overdue']);

// El identificador del prestamo debe ser numerico.
Route::get('/loans/{id}', [LoanController::class, 'show'])
    ->whereNumber('id');

Route::post('/loans', [LoanController::class, 'store']);

// Devoluciones
Route::post('/loans/{loanId}/returns', [ReturnController::class, 'store']);

// Reportes
Route::get(
    '/reports/most-requested-instruments',
    [ReportController::class, 'mostRequestedInstruments']
);

// Historial de prestamos de un estudiante.
Route::get('/students/{id}/loans', [StudentController::class, 'loans']);