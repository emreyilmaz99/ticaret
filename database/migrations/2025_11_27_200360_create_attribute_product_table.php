<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // If the table already exists (leftover from a failed migration run), skip creation.
        if (Schema::hasTable('attribute_product')) {
            return;
        }

        Schema::create('attribute_product', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('attribute_id');
            $table->ulid('product_id');
            $table->unsignedBigInteger('attribute_value_id')->nullable();
            $table->string('value')->nullable();
            $table->timestamps();

            $table->foreign('attribute_id')->references('id')->on('attributes')->cascadeOnDelete();
            $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->nullOnDelete();
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->unique(['attribute_id','product_id','attribute_value_id'], 'attr_prod_attr_prod_val_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attribute_product');
    }
};
