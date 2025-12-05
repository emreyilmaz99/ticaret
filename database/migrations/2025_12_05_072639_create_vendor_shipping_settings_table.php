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
        Schema::create('vendor_shipping_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->unique()->constrained('vendors')->onDelete('cascade');
            $table->decimal('shipping_cost', 10, 2)->default(29.90)->comment('Kargo ücreti');
            $table->decimal('free_shipping_threshold', 10, 2)->default(300.00)->comment('Ücretsiz kargo alt limiti');
            $table->boolean('is_shipping_enabled')->default(true)->comment('Kargo aktif mi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_shipping_settings');
    }
};
