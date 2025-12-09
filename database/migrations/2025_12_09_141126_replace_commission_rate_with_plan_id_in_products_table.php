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
        Schema::table('products', function (Blueprint $table) {
            // commission_rate sütununu kaldır
            $table->dropColumn('commission_rate');
            
            // commission_plan_id FK ekle
            $table->foreignId('commission_plan_id')
                  ->nullable()
                  ->after('tax_class_id')
                  ->constrained('commission_plans')
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // FK'yi kaldır
            $table->dropForeign(['commission_plan_id']);
            $table->dropColumn('commission_plan_id');
            
            // commission_rate sütununu geri ekle
            $table->decimal('commission_rate', 5, 2)->nullable()->after('tax_class_id');
        });
    }
};
