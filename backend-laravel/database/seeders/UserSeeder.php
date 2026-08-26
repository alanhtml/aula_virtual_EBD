<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrador Principal (Director)
        User::updateOrCreate(
            ['username' => 'admin-director'],
            [
                'name' => 'Administrador General',
                'email' => 'admin@filadelfia.edu',
                'role' => 'director',
                'password' => Hash::make('admin777'),
            ]
        );

        // Usuario Director de prueba
        User::updateOrCreate(
            ['username' => 'director-001'],
            [
                'name' => 'Alan Director',
                'email' => 'director@filadelfia.edu',
                'role' => 'director',
                'password' => Hash::make('password123'),
            ]
        );

        // Usuario Estudiante de prueba
        User::updateOrCreate(
            ['username' => '2024-001'],
            [
                'name' => 'Estudiante de Prueba',
                'email' => 'estudiante@filadelfia.edu',
                'role' => 'estudiantes',
                'password' => Hash::make('password123'),
            ]
        );

        // Usuario Docente de prueba
        User::updateOrCreate(
            ['username' => 'docente-001'],
            [
                'name' => 'Profesor Biblia',
                'email' => 'docente@filadelfia.edu',
                'role' => 'docentes',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
