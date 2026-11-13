
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Add a database constraint to protect inventory quantities.
     */
    public function up(): void
    {
        DB::statement(
            'ALTER TABLE instruments
             ADD CONSTRAINT chk_instruments_inventory
             CHECK (available_units <= total_units)'
        );
    }

    /**
     * Remove the inventory constraint when rolling back.
     */
    public function down(): void
    {
        DB::statement(
            'ALTER TABLE instruments
             DROP CHECK chk_instruments_inventory'
        );
    }
};
