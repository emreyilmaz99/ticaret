<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Sipariş kalemleri - iyzico basketItems + Marketplace SubMerchant bilgileri
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            
            // Ürün referansları
            $table->char('product_id', 26)->comment('ULID');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            
            // Ürün bilgileri (snapshot - fiyat/isim değişse bile orijinal kalır)
            $table->string('product_name');
            $table->string('variant_title')->nullable();
            $table->string('sku', 100)->nullable();
            
            // Miktar ve fiyat
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('line_total', 10, 2);
            
            // Kampanya indirimi (varsa)
            $table->decimal('campaign_discount', 10, 2)->default(0);
            $table->string('campaign_name')->nullable();
            
            // iyzico Marketplace - SubMerchant paylaşımı
            $table->string('submerchant_key', 100)->nullable()->comment('Vendor iyzico key');
            $table->decimal('submerchant_price', 10, 2)->nullable()->comment('Vendor alacağı tutar');
            $table->decimal('commission_rate', 5, 2)->default(0)->comment('Platform komisyon oranı %');
            $table->decimal('commission_amount', 10, 2)->default(0)->comment('Platform komisyon tutarı');
            
            // iyzico yanıtından
            $table->string('iyzico_item_id', 50)->nullable();
            $table->string('iyzico_payment_transaction_id', 50)->nullable();
            $table->tinyInteger('iyzico_transaction_status')->nullable();
            
            // Sipariş durumu (satıcı bazlı)
            $table->enum('status', [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ])->default('pending');
            
            $table->timestamps();
            
            // İndeksler
            $table->index(['order_id', 'vendor_id']);
            $table->index('vendor_id');
            $table->index('product_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
