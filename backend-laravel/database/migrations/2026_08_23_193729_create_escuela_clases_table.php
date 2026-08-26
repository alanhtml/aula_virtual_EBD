<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('escuela_clases', function (Blueprint $bar) {
            $bar->id();
            $bar->string('nombre'); // Parvulos, Niños, Adolescentes, Jovenes
            $bar->string('rango_edad');
            $bar->text('descripcion')->nullable();
            $bar->foreignId('docente_id')->nullable()->constrained('users')->onDelete('set null');
            $bar->timestamps();
        });

        Schema::create('escuela_clase_estudiante', function (Blueprint $bar) {
            $bar->id();
            $bar->foreignId('escuela_clase_id')->constrained()->onDelete('cascade');
            $bar->string('nombre_estudiante');
            $bar->integer('edad');
            $bar->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('escuela_clase_estudiante');
        Schema::dropIfExists('escuela_clases');
    }
};
