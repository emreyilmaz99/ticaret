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
        Schema::create('featured_deals', function (Blueprint $table) {
            $table->id();
            $table->string('product_id'); // ULID
            $table->unsignedBigInteger('variant_id')->nullable();
            
            // Price fields
            $table->decimal('deal_price', 12, 2);
            $table->decimal('original_price', 12, 2);
            $table->decimal('discount_percentage', 5, 2);
            
            // Content fields
            $table->string('title');
            $table->text('description')->nullable();
            
            // Style customization
            $table->string('background_color', 20)->default('#1E293B');
            $table->string('badge_text', 50)->default('Günün Fırsatı');
            $table->string('badge_color', 20)->default('#EF4444');
            
            // Time management
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Statistics
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('click_count')->default(0);
            $table->unsignedInteger('conversion_count')->default(0);
            
            // Display order for carousel
            $table->unsignedInteger('sort_order')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Foreign keys
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('variant_id')->references('id')->on('product_variants')->nullOnDelete();
            
            // Indexes
            $table->index(['is_active', 'starts_at', 'ends_at']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_deals');
    }
};
