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
            // Remove columns that are now in vendor_media table
            if (Schema::hasColumn('vendors', 'logo_path')) {
                $table->dropColumn('logo_path');
            }
            if (Schema::hasColumn('vendors', 'cover_path')) {
                $table->dropColumn('cover_path');
            }
            
            // Remove columns that are now in vendor_settings table
            if (Schema::hasColumn('vendors', 'settings')) {
                $table->dropColumn('settings');
            }
            
            // Remove columns that are now in vendor_metadata table
            if (Schema::hasColumn('vendors', 'metadata')) {
                $table->dropColumn('metadata');
            }
            
            // rating_avg and rating_count stay - they're computed fields for performance
            // balance and commission_rate stay - they're core vendor financial fields
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            // Restore removed columns
            $table->string('logo_path')->nullable();
            $table->string('cover_path')->nullable();
            $table->json('settings')->nullable();
            $table->json('metadata')->nullable();
        });
    }
};
