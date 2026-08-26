<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: Teología Sistemática I
            $table->enum('nivel', ['101', '201', '301', '401', '501']);
            $table->string('semestre'); // Ej: 2024-II
            $table->string('horario')->default('Domingos');
            $table->text('descripcion')->nullable();
            $table->string('codigo')->unique(); // Ej: MOD-101-2024
            $table->foreignId('docente_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
