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
        Schema::create('vendor_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->nullable()->constrained('vendors')->onDelete('cascade');
            
            // Application Type
            $table->enum('type', ['pre_application', 'full_application'])->default('pre_application');
            
            // Application Status
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            // Applicant Information
            $table->string('email')->index();
            $table->string('full_name');
            $table->string('company_name')->nullable();
            $table->string('phone')->nullable();
            
            // Admin Review
            $table->foreignId('reviewed_by')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('status');
            $table->index('type');
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_applications');
    }
};
