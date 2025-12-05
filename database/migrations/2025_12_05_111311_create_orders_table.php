<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Sipariş tablosu - iyzico Checkout Form entegrasyonu
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Sipariş numarası
            $table->string('order_number', 20)->unique();
            
            // Sipariş durumları
            $table->enum('status', [
                'pending',      // Ödeme bekleniyor
                'paid',         // Ödeme alındı
                'processing',   // Hazırlanıyor
                'shipped',      // Kargoya verildi
                'delivered',    // Teslim edildi
                'cancelled',    // İptal edildi
                'refunded'      // İade edildi
            ])->default('pending');
            
            $table->enum('payment_status', [
                'pending',      // Bekleniyor
                'processing',   // İşleniyor (3DS sayfasında)
                'paid',         // Ödendi
                'failed',       // Başarısız
                'refunded'      // İade edildi
            ])->default('pending');
            
            // Adres bilgileri (JSON snapshot)
            $table->json('shipping_address');
            $table->json('billing_address')->nullable();
            
            // Fiyat bilgileri
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_total', 10, 2)->default(0);
            $table->decimal('discount_total', 10, 2)->default(0);
            $table->decimal('campaign_discount', 10, 2)->default(0);
            $table->decimal('coupon_discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency', 3)->default('TRY');
            
            // Kupon bilgisi
            $table->string('coupon_code', 50)->nullable();
            $table->foreignId('coupon_id')->nullable()->constrained('vendor_coupons')->nullOnDelete();
            
            // iyzico Checkout Form bilgileri
            $table->string('iyzico_token', 100)->nullable()->comment('CF Başlatma token');
            $table->string('iyzico_conversation_id', 100)->nullable();
            $table->string('iyzico_payment_id', 50)->nullable()->comment('CF Sorgulama sonucu');
            $table->tinyInteger('iyzico_fraud_status')->nullable()->comment('1=approved, -1=rejected, 0=review');
            $table->json('iyzico_raw_response')->nullable();
            
            // Kart bilgileri (maskeli)
            $table->string('card_type', 20)->nullable();
            $table->string('card_association', 20)->nullable();
            $table->string('card_family', 50)->nullable();
            $table->string('card_bin', 8)->nullable();
            $table->string('card_last_four', 4)->nullable();
            $table->tinyInteger('installment_count')->default(1);
            
            // Diğer
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            // İndeksler
            $table->index(['user_id', 'status']);
            $table->index('order_number');
            $table->index('iyzico_token');
            $table->index('iyzico_payment_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
