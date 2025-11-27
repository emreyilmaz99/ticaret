<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('name');
            $table->string('slug')->nullable()->unique()->after('company_name');
            $table->string('tax_id')->nullable()->after('slug');
            $table->string('phone')->nullable()->after('tax_id');
            $table->string('logo_path')->nullable()->after('phone');
            $table->string('cover_path')->nullable()->after('logo_path');
            $table->decimal('rating_avg', 3, 2)->default(0)->after('cover_path');
            $table->unsignedInteger('rating_count')->default(0)->after('rating_avg');
            $table->decimal('balance', 12, 2)->default(0)->after('rating_count');
            $table->decimal('commission_rate', 5, 2)->default(0)->after('balance');
            $table->json('settings')->nullable()->after('commission_rate');
            $table->json('metadata')->nullable()->after('settings');
            if (!Schema::hasColumn('vendors', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            if (Schema::hasColumn('vendors', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            $table->dropColumn([
                'company_name', 'slug', 'tax_id', 'phone', 'logo_path', 'cover_path',
                'rating_avg', 'rating_count', 'balance', 'commission_rate', 'settings', 'metadata'
            ]);
        });
    }
};
