<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'student_code' => 'EST-001',
                'full_name' => 'Carlos Ramirez',
                'email' => 'carlos.ramirez@example.com',
            ],
            [
                'student_code' => 'EST-002',
                'full_name' => 'Laura Martinez',
                'email' => 'laura.martinez@example.com',
            ],
            [
                'student_code' => 'EST-003',
                'full_name' => 'Andres Gomez',
                'email' => 'andres.gomez@example.com',
            ],
            [
                'student_code' => 'EST-004',
                'full_name' => 'Maria Rodriguez',
                'email' => 'maria.rodriguez@example.com',
            ],
            [
                'student_code' => 'EST-005',
                'full_name' => 'Daniel Torres',
                'email' => 'daniel.torres@example.com',
            ],
        ];

        foreach ($students as $student) {
            DB::table('students')->updateOrInsert(
                ['student_code' => $student['student_code']],
                [
                    'full_name' => $student['full_name'],
                    'email' => $student['email'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
