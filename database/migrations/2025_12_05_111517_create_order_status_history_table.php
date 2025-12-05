<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Sipariş durum değişikliği geçmişi
     */
    public function up(): void
    {
        Schema::create('order_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            
            $table->string('old_status', 20)->nullable();
            $table->string('new_status', 20);
            
            $table->text('note')->nullable();
            
            // Kim değiştirdi?
            $table->string('changed_by_type', 20)->nullable()->comment('user, vendor, admin, system');
            $table->unsignedBigInteger('changed_by_id')->nullable();
            
            $table->timestamps();
            
            $table->index(['order_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_history');
    }
};
