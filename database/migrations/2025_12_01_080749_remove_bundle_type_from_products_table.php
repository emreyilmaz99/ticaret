<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Change type enum to only allow 'simple' and 'variable'
            // Remove 'bundle' option
            DB::statement("ALTER TABLE products MODIFY COLUMN type ENUM('simple', 'variable') NOT NULL DEFAULT 'simple'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Restore bundle option
            DB::statement("ALTER TABLE products MODIFY COLUMN type ENUM('simple', 'variable', 'bundle') NOT NULL DEFAULT 'simple'");
        });
    }
};
