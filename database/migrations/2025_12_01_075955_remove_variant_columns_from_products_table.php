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
            // Remove variant-specific columns - these belong in product_variants table
            // Products table should only contain master product information
            
            if (Schema::hasColumn('products', 'price')) {
                $table->dropColumn('price');
            }
            if (Schema::hasColumn('products', 'compare_at_price')) {
                $table->dropColumn('compare_at_price');
            }
            if (Schema::hasColumn('products', 'weight')) {
                $table->dropColumn('weight');
            }
            if (Schema::hasColumn('products', 'length')) {
                $table->dropColumn('length');
            }
            if (Schema::hasColumn('products', 'width')) {
                $table->dropColumn('width');
            }
            if (Schema::hasColumn('products', 'height')) {
                $table->dropColumn('height');
            }
            // SKU can stay in products as a general product SKU (optional)
            // Each variant will have its own specific SKU in product_variants
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('compare_at_price', 12, 2)->nullable();
            $table->decimal('weight', 10, 2)->nullable();
            $table->decimal('length', 10, 2)->nullable();
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();
        });
    }
};
