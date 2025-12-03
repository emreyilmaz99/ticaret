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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label', 50);                    // Ev, İş, vb.
            $table->string('full_name');                    // Teslimat alıcısı
            $table->string('phone', 20);                    // Teslimat telefonu
            $table->string('country', 100)->default('Türkiye');
            $table->string('city', 100);                    // İl
            $table->string('district', 100);                // İlçe
            $table->string('neighborhood');                 // Mahalle
            $table->text('address_line');                   // Açık adres
            $table->string('postal_code', 10)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
