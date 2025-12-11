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
        Schema::table('featured_deals', function (Blueprint $table) {
            // Add index on product_id for better JOIN performance
            $table->index('product_id', 'featured_deals_product_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('featured_deals', function (Blueprint $table) {
            $table->dropIndex('featured_deals_product_id_index');
        });
    }
};
