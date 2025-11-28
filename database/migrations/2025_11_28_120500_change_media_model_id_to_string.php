<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert model_id to a string type to support ULIDs/UUIDs
        DB::statement('ALTER TABLE `media` MODIFY `model_id` VARCHAR(36) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to unsigned big integer. This may fail if non-numeric ids exist.
        DB::statement('ALTER TABLE `media` MODIFY `model_id` BIGINT UNSIGNED NOT NULL');
    }
};
