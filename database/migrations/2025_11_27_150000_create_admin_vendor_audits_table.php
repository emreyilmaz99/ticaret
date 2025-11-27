<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    // Intentionally left blank to avoid creating audit tables automatically.
    // User requested no DB changes for financial/audit tables; keep migration as no-op.
    public function up(): void
    {
        // no-op
    }

    public function down(): void
    {
        // no-op
    }
};
