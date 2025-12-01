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
        Schema::table('vendors', function (Blueprint $table) {
            $table->foreignId('commission_plan_id')
                ->nullable()
                ->after('id')
                ->constrained('commission_plans')
                ->onDelete('restrict');
            
            $table->index('commission_plan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign(['commission_plan_id']);
            $table->dropIndex(['commission_plan_id']);
            $table->dropColumn('commission_plan_id');
        });
    }
};
