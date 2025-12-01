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
        Schema::table('products', function (Blueprint $table) {
            // Remove JSON columns now normalized into separate tables
            if (Schema::hasColumn('products', 'settings')) {
                $table->dropColumn('settings');
            }
            if (Schema::hasColumn('products', 'metadata')) {
                $table->dropColumn('metadata');
            }
        });
        
        Schema::table('product_variants', function (Blueprint $table) {
            // Remove metadata JSON column from variants
            if (Schema::hasColumn('product_variants', 'metadata')) {
                $table->dropColumn('metadata');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('settings')->nullable();
            $table->json('metadata')->nullable();
        });
        
        Schema::table('product_variants', function (Blueprint $table) {
            $table->json('metadata')->nullable();
        });
    }
};
