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
        Schema::create('product_variant_metadata', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_id');
            $table->string('meta_key', 100);
            $table->text('meta_value');
            $table->timestamps();

            $table->foreign('variant_id')->references('id')->on('product_variants')->cascadeOnDelete();
            $table->unique(['variant_id', 'meta_key']);
            $table->index('variant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variant_metadata');
    }
};
