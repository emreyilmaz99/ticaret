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
        // MySQL enum değişikliği için raw SQL kullanmalıyız
        // Vendor model'deki tüm status sabitleri:
        // pre_pending, pre_approved, pending_full_approval, pending_activation, active, inactive, suspended, banned, rejected
        DB::statement("ALTER TABLE vendors MODIFY COLUMN status ENUM(
            'pre_pending',
            'pre_approved',
            'pending_full_approval',
            'pending_activation',
            'active',
            'inactive',
            'suspended',
            'banned',
            'rejected'
        ) DEFAULT 'pre_approved'");
        
        // Mevcut 'inactive' olanları 'pending_full_application' yap (ön başvurudan gelen yeni vendorlar)
        DB::statement("UPDATE vendors SET status = 'pending_full_application' WHERE status = 'inactive' AND onboarding_completed = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Yeni statusları inactive'e çevir
        DB::statement("UPDATE vendors SET status = 'inactive' WHERE status IN ('pending_pre_approval', 'pending_full_application', 'pending_activation', 'rejected')");
        
        // Eski enum'a geri dön
        DB::statement("ALTER TABLE vendors MODIFY COLUMN status ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'inactive'");
    }
};
