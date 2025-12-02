<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Drop the global unique constraint on slug
            $table->dropUnique(['slug']);
            
            // Add composite unique constraint: vendor_id + slug
            // This allows different vendors to have categories with the same slug
            $table->unique(['vendor_id', 'slug'], 'categories_vendor_slug_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Drop composite unique
            $table->dropUnique('categories_vendor_slug_unique');
            
            // Restore global unique on slug
            $table->unique('slug');
        });
    }
};
