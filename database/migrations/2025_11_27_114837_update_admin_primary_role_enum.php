<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            // Add 'admin' and 'editor' to the ENUM
            DB::statement("ALTER TABLE `admins` MODIFY `primary_role` ENUM('super-admin','moderator','blog','admin','editor') NULL;");
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            // Revert to original
            DB::statement("ALTER TABLE `admins` MODIFY `primary_role` ENUM('super-admin','moderator','blog') NULL;");
        }
    }
};
