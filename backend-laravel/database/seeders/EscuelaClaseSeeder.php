<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EscuelaClase;

class EscuelaClaseSeeder extends Seeder
{
    public function run(): void
    {
        $clases = [
            ['nombre' => 'Párvulos', 'rango_edad' => '3-6 años', 'descripcion' => 'Iniciación en las historias bíblicas básicas.'],
            ['nombre' => 'Niños', 'rango_edad' => '7-12 años', 'descripcion' => 'Aprendizaje dinámico y principios cristianos.'],
            ['nombre' => 'Adolescentes', 'rango_edad' => '13-17 años', 'descripcion' => 'Desafíos de la fe en la etapa escolar.'],
            ['nombre' => 'Jóvenes', 'rango_edad' => '18+ años', 'descripcion' => 'Liderazgo y vida cristiana práctica.'],
        ];

        foreach ($clases as $clase) {
            EscuelaClase::updateOrCreate(['nombre' => $clase['nombre']], $clase);
        }
    }
}
