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
                'nombre' => 'Fundamentos de la Fe',
                'nivel' => '101',
                'semestre' => 'Periodo I (Feb-May) 2026',
                'horario' => 'Domingos 08:00 - 12:00',
                'codigo' => '101-PI-2026',
                'descripcion' => 'Establece las bases sólidas de la doctrina cristiana y el estudio bíblico fundamental.',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Historia del Cristianismo',
                'nivel' => '201',
                'semestre' => 'Periodo I (Feb-May) 2026',
                'horario' => 'Domingos 08:00 - 12:00',
                'codigo' => '201-PI-2026',
                'descripcion' => 'Recorrido histórico desde la iglesia primitiva hasta el movimiento contemporáneo.',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Hermenéutica Bíblica',
                'nivel' => '301',
                'semestre' => 'Periodo I (Feb-May) 2026',
                'horario' => 'Domingos 08:00 - 12:00',
                'codigo' => '301-PI-2026',
                'descripcion' => 'Principios y métodos de interpretación bíblica correcta para la predicación y enseñanza.',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Teología Sistemática',
                'nivel' => '401',
                'semestre' => 'Periodo I (Feb-May) 2026',
                'horario' => 'Domingos 08:00 - 12:00',
                'codigo' => '401-PI-2026',
                'descripcion' => 'Estudio ordenado de las doctrinas bíblicas principales y su aplicación práctica.',
                'docente_id' => $docenteId,
            ],
            [
                'nombre' => 'Liderazgo y Misiones',
                'nivel' => '501',
                'semestre' => 'Periodo I (Feb-May) 2026',
                'horario' => 'Domingos 08:00 - 12:00',
                'codigo' => '501-PI-2026',
                'descripcion' => 'Capacitación para el servicio ministerial, plantación de iglesias y liderazgo de grupos.',
                'docente_id' => $docenteId,
            ],
        ];

        foreach ($modulos as $modulo) {
            Curso::updateOrCreate(['codigo' => $modulo['codigo']], $modulo);
        }
    }
}
