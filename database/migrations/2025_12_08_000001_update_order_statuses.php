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
        // 1. Geçici olarak 'paid' değerini 'processing' yap (çünkü ENUM'da hala mevcut)
        DB::table('orders')
            ->where('status', 'paid')
            ->update(['status' => 'processing']);

        // 2. status ENUM'una yeni değerleri ekle
        DB::statement("ALTER TABLE `orders` MODIFY COLUMN `status` ENUM(
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'returned'
        ) NOT NULL DEFAULT 'pending'");

        // 3. 'processing' olanları 'confirmed' yap
        DB::table('orders')
            ->where('status', 'processing')
            ->where('payment_status', 'paid')
            ->update(['status' => 'confirmed']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Geri al - eski ENUM değerlerini koru
        DB::statement("ALTER TABLE `orders` MODIFY COLUMN `status` ENUM(
            'pending',
            'paid',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        ) NOT NULL DEFAULT 'pending'");

        DB::table('orders')
            ->where('status', 'confirmed')
            ->update(['status' => 'paid']);
    }
};
