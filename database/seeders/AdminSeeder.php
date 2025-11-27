<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin guard'ı için rolleri oluştur
        $roles = [
            'super-admin' => 'Süper Yönetici',
            'admin' => 'Yönetici',
            'editor' => 'Editör',
            'moderator' => 'Moderatör'
        ];

        foreach ($roles as $key => $label) {
            Role::firstOrCreate(['name' => $key, 'guard_name' => 'admin']);
        }

        // 2. Örnek Adminler Oluştur
        
        // Süper Admin
        $superAdmin = Admin::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Süper Admin',
                'password' => 'password', // Mutator will hash this
                'is_active' => true,
                'primary_role' => 'super-admin'
            ]
        );
        $superAdmin->syncRoles(['super-admin']);

        // Editör
        $editor = Admin::firstOrCreate(
            ['email' => 'editor@admin.com'],
            [
                'name' => 'Ahmet Editör',
                'password' => 'password',
                'is_active' => true,
                'primary_role' => 'editor'
            ]
        );
        $editor->syncRoles(['editor']);

        // Moderatör
        $mod = Admin::firstOrCreate(
            ['email' => 'mod@admin.com'],
            [
                'name' => 'Ayşe Moderatör',
                'password' => 'password',
                'is_active' => true,
                'primary_role' => 'moderator'
            ]
        );
        $mod->syncRoles(['moderator']);
    }
}
