<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class CreateRoles extends Command
{
    protected $signature = 'app:create-roles {--guards=* : Guards to create roles for (comma-separated)}';

    protected $description = 'Create default roles for application (admin, vendor, customer)';

    public function handle(): int
    {
        $guards = $this->option('guards') ?: ['web', 'admin'];

        $roles = ['admin', 'vendor', 'customer'];

        foreach ($guards as $guard) {
            foreach ($roles as $roleName) {
                Role::firstOrCreate(['name' => $roleName, 'guard_name' => $guard]);
                $this->info("Role {$roleName} created for guard {$guard}");
            }
        }

        $this->info('Default roles created.');

        return Command::SUCCESS;
    }
}
