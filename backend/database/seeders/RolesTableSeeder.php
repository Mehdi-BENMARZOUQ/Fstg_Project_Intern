<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'name' => 'SGeneral',
            'display_name' => 'Secrétaire Général',
            'description' => 'Secrétaire Général'
        ]);
        Role::create([
            'name' => 'Communication',
            'display_name' => 'Communication',
            'description' => 'Communication'
        ]);
        Role::create([
            'name' => 'Student',
            'display_name' => 'Student',
            'description' => 'Student'
        ]);
    }
}
