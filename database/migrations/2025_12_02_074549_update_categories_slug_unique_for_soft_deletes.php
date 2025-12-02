<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Remove the unique constraint entirely and handle uniqueness at application level.
     * This allows soft-deleted records to have the same slug as new records.
     */
    public function up(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Drop the unique index
        DB::statement('ALTER TABLE `categories` DROP INDEX `categories_vendor_slug_unique`');
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        // Add a regular index for performance (not unique)
        Schema::table('categories', function (Blueprint $table) {
            $table->index(['vendor_id', 'slug'], 'categories_vendor_slug_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_vendor_slug_index');
            $table->unique(['vendor_id', 'slug'], 'categories_vendor_slug_unique');
        });
    }
};
