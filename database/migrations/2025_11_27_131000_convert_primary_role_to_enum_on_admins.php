<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        // Attempt to convert to enum on MySQL/MariaDB. For other drivers
        // we skip to avoid complex cross-driver ALTER logic.
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            // note: use the same allowed values as Admin::PRIMARY_ROLES
            DB::statement("ALTER TABLE `admins` MODIFY `primary_role` ENUM('super-admin','moderator','blog') NULL;");
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `admins` MODIFY `primary_role` VARCHAR(100) NULL;");
        }
    }
};
