<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // vendor_id'yi kaldır (artık kategoriler admin tarafından yönetilecek)
            if (Schema::hasColumn('categories', 'vendor_id')) {
                // Foreign key kaldır (eğer varsa)
                try {
                    $table->dropForeign(['vendor_id']);
                } catch (\Exception $e) {
                    // foreign key olmayabilir
                }
                $table->dropColumn('vendor_id');
            }
            
            // icon alanı ekle (yoksa)
            if (!Schema::hasColumn('categories', 'icon')) {
                $table->string('icon')->nullable()->after('slug');
            }
            
            // image alanı ekle (yoksa)
            if (!Schema::hasColumn('categories', 'image')) {
                $table->string('image')->nullable()->after('icon');
            }
        });
        
        // Mevcut kategorileri temizle (admin sistemine geçiş)
        // Önce foreign key kontrolünü devre dışı bırak
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('category_product')->truncate();
        DB::table('categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'image')) {
                $table->dropColumn('image');
            }
            if (!Schema::hasColumn('categories', 'vendor_id')) {
                $table->unsignedBigInteger('vendor_id')->nullable()->after('parent_id');
            }
        });
    }
};
