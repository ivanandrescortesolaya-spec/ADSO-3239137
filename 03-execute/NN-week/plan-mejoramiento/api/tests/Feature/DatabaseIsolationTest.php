<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseIsolationTest extends TestCase
{
    public function test_phpunit_uses_the_test_database(): void
    {
        // Verify the database selected by PHPUnit.
        $database = DB::connection()->getDatabaseName();

        $this->assertSame('music_school_test', $database);
    }
}

