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
        Schema::create('vendor_earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('order_item_id')->unique()->constrained('order_items')->onDelete('cascade');
            
            // Financial breakdown
            $table->decimal('gross_amount', 12, 2)->comment('KDV hariç satış tutarı');
            $table->decimal('commission_rate', 5, 2)->comment('Uygulanan komisyon oranı (%)');
            $table->decimal('commission_amount', 12, 2)->comment('Komisyon tutarı');
            $table->decimal('withholding_tax_rate', 5, 2)->default(0)->comment('Stopaj oranı (%)');
            $table->decimal('withholding_tax_amount', 12, 2)->default(0)->comment('Stopaj tutarı');
            $table->decimal('net_earning', 12, 2)->comment('Net kazanç (gross - commission - stopaj)');
            
            // Status tracking
            $table->enum('earning_status', ['pending', 'available', 'settled', 'refunded'])
                  ->default('pending')
                  ->comment('pending: Beklemede, available: Çekilebilir, settled: Ödendi, refunded: İade');
            
            $table->timestamp('available_at')->nullable()->comment('Çekilebilir hale gelme tarihi');
            $table->timestamp('settled_at')->nullable()->comment('Ödeme tarihi');
            
            // Payout reference
            $table->foreignId('payout_id')->nullable()->constrained('vendor_payouts')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['vendor_id', 'earning_status']);
            $table->index('order_id');
            $table->index('payout_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_earnings');
    }
};
