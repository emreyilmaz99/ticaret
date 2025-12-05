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
        Schema::create('vendor_coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->string('code', 50);
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('discount_amount', 10, 2); // Sabit tutar indirimi
            $table->decimal('min_order_amount', 10, 2)->default(0); // Minimum sepet tutarı
            $table->integer('usage_limit')->nullable(); // Toplam kullanım limiti
            $table->integer('usage_limit_per_user')->nullable(); // Kişi başı limit
            $table->integer('usage_count')->default(0); // Kullanım sayısı
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['vendor_id', 'code']); // Aynı satıcıda aynı kod olamaz
            $table->index('code');
            $table->index('is_active');
        });

        // Kupon kullanım takibi
        Schema::create('coupon_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained('vendor_coupons')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->decimal('discount_applied', 10, 2);
            $table->timestamps();

            $table->index(['coupon_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_usages');
        Schema::dropIfExists('vendor_coupons');
    }
};
