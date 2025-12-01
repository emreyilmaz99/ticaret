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
        // First, normalize existing status values to match new enum
        DB::statement("UPDATE vendors SET status = 'inactive' WHERE status NOT IN ('active', 'inactive', 'suspended', 'banned')");
        
        Schema::table('vendors', function (Blueprint $table) {
            // Simplified status
            $table->enum('status', ['active', 'inactive', 'suspended', 'banned'])
                ->default('inactive')->change();
            
            // Onboarding tracking
            $table->boolean('onboarding_completed')->default(false)->after('status');
            $table->timestamp('activated_at')->nullable()->after('onboarding_completed');
            
            // Application reference
            $table->foreignId('application_id')->nullable()->after('id')
                ->constrained('vendor_applications')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign(['application_id']);
            $table->dropColumn(['application_id', 'onboarding_completed', 'activated_at']);
            $table->string('status')->default('pending')->change();
        });
    }
};
