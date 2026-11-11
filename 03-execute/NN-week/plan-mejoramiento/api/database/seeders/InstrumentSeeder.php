<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstrumentSeeder extends Seeder
{
    public function run(): void
    {
        $instruments = [
            [
                'category_code' => 'CAT-01',
                'code' => 'INS-001',
                'name' => 'Guitarra acustica',
                'total_units' => 10,
            ],
            [
                'category_code' => 'CAT-01',
                'code' => 'INS-002',
                'name' => 'Violin',
                'total_units' => 8,
            ],
            [
                'category_code' => 'CAT-02',
                'code' => 'INS-003',
                'name' => 'Flauta dulce',
                'total_units' => 12,
            ],
            [
                'category_code' => 'CAT-02',
                'code' => 'INS-004',
                'name' => 'Saxofon alto',
                'total_units' => 4,
            ],
            [
                'category_code' => 'CAT-03',
                'code' => 'INS-005',
                'name' => 'Bateria acustica',
                'total_units' => 3,
            ],
            [
                'category_code' => 'CAT-03',
                'code' => 'INS-006',
                'name' => 'Bongos',
                'total_units' => 6,
            ],
            [
                'category_code' => 'CAT-04',
                'code' => 'INS-007',
                'name' => 'Piano digital',
                'total_units' => 5,
            ],
            [
                'category_code' => 'CAT-04',
                'code' => 'INS-008',
                'name' => 'Teclado electronico',
                'total_units' => 7,
            ],
            [
                'category_code' => 'CAT-05',
                'code' => 'INS-009',
                'name' => 'Guitarra electrica',
                'total_units' => 5,
            ],
            [
                'category_code' => 'CAT-05',
                'code' => 'INS-010',
                'name' => 'Bajo electrico',
                'total_units' => 4,
            ],
        ];

        foreach ($instruments as $instrument) {
            $category = DB::table('categories')
                ->where('code', $instrument['category_code'])
                ->first();

            if (!$category) {
                throw new \RuntimeException(
                    "No existe la categoria {$instrument['category_code']}."
                );
            }

            DB::table('instruments')->updateOrInsert(
                ['code' => $instrument['code']],
                [
                    'category_id' => $category->id,
                    'name' => $instrument['name'],
                    'total_units' => $instrument['total_units'],
                    'available_units' => $instrument['total_units'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
