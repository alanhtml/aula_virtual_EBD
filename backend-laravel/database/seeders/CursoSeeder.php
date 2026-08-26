<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Seeder;

class CursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $docente = User::where('role', 'docentes')->first();
        $docenteId = $docente ? $docente->id : null;

        $modulos = [
            [
                'nombre' => 'Introducción a la Teología',
                'nivel' => '101',
                'semestre' => '2024-II',
                'horario' => 'Domingos',
                'codigo' => 'MOD-101-2024',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Historia de la Iglesia I',
                'nivel' => '201',
                'semestre' => '2024-II',
                'horario' => 'Domingos',
                'codigo' => 'MOD-201-2024',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Hermenéutica Bíblica',
                'nivel' => '301',
                'semestre' => '2024-II',
                'horario' => 'Domingos',
                'codigo' => 'MOD-301-2024',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Homilética y Liderazgo',
                'nivel' => '401',
                'semestre' => '2024-II',
                'horario' => 'Domingos',
                'codigo' => 'MOD-401-2024',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Ética Cristiana Ministerial',
                'nivel' => '501',
                'semestre' => '2024-II',
                'horario' => 'Domingos',
                'codigo' => 'MOD-501-2024',
                'docente_id' => $docenteId,
            ],
        ];

        foreach ($modulos as $modulo) {
            Curso::updateOrCreate(['codigo' => $modulo['codigo']], $modulo);
        }
    }
}
