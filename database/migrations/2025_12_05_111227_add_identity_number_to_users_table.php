<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * iyzico Checkout Form için buyer identity_number zorunlu.
     * TC Kimlik No: 11 haneli rakam
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('identity_number', 11)
                ->nullable()
                ->after('phone')
                ->comment('TC Kimlik No - iyzico buyer için gerekli');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('identity_number');
        });
    }
};
