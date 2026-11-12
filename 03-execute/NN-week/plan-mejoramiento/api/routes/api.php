<?php

use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\InstrumentController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\ReturnController;

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::patch('/categories/{id}/deactivate', [CategoryController::class, 'deactivate'])->whereNumber('id');
Route::patch('/categories/{id}/activate', [CategoryController::class, 'activate'])->whereNumber('id');
// Instruments
Route::get('/instruments', [InstrumentController::class, 'index']);
Route::get('/instruments/{id}', [InstrumentController::class, 'show']);
Route::post('/instruments', [InstrumentController::class, 'store']);
Route::put('/instruments/{id}', [InstrumentController::class, 'update']);
Route::patch('/instruments/{id}/deactivate', [InstrumentController::class, 'deactivate']);
// Students
Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);

// Loans
Route::get('/loans', [LoanController::class, 'index']);
Route::get('/loans/overdue', [LoanController::class, 'overdue']);

// The loan identifier must be numeric.
Route::get('/loans/{id}', [LoanController::class, 'show'])
    ->whereNumber('id');

Route::post('/loans', [LoanController::class, 'store']);

// Returns
Route::post('/loans/{loanId}/returns', [ReturnController::class, 'store']);

// Reports
Route::get(
    '/reports/most-requested-instruments',
    [ReportController::class, 'mostRequestedInstruments']
);

// A student's loan history.
Route::get('/students/{id}/loans', [StudentController::class, 'loans']);
