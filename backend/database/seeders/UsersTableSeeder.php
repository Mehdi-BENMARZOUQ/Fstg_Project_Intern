<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sgRole = Role::where('name', 'SGeneral')->first();
        $communicationRole = Role::where('name', 'Communication')->first();
        $superAdminRole = Role::where('name', 'Admin')->first();
        $studentRole = Role::where('name', 'Student')->first();

        $sgUser = User::create([
            'name' => 'SGeneral',
            'email' => 'fstg.sg@uca.ac.ma',
            'password' => Hash::make('password'),
        ]);
        $sgUser->roles()->sync([$sgRole->id]);

        $communicationUser = User::create([
            'name' => 'Communication',
            'email' => 'fstg.communication@uca.ac.ma',
            'password' => Hash::make('password'),
        ]);
        $communicationUser->roles()->sync([$communicationRole->id]);

        $adminUser = User::create([
            'name' => 'admin',
            'email' => 'fstg.admin@uca.ac.ma',
            'password' => Hash::make('password'),
        ]);
        $adminUser->roles()->sync([$superAdminRole->id]);

        $studentUser = User::create([
            'name' => 'student',
            'email' => 'fstg.student@uca.ac.ma',
            'password' => Hash::make('password'),
        ]);
        $studentUser->roles()->sync([$studentRole->id]);

    }
}
