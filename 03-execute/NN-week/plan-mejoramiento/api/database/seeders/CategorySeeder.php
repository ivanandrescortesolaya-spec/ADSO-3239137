<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'CAT-01',
                'name' => 'Cuerdas',
            ],
            [
                'code' => 'CAT-02',
                'name' => 'Vientos',
            ],
            [
                'code' => 'CAT-03',
                'name' => 'Percusión',
            ],
            [
                'code' => 'CAT-04',
                'name' => 'Teclados',
            ],
            [
                'code' => 'CAT-05',
                'name' => 'Electrónicos',
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['code' => $category['code']],
                [
                    'name' => $category['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
