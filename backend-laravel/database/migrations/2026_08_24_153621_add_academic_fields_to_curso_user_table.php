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
        Schema::table('curso_user', function (Blueprint $table) {
            $table->decimal('nota_final', 5, 2)->nullable();
            $table->integer('faltas_consecutivas')->default(0);
            $table->integer('total_faltas')->default(0);
            $table->enum('estado', ['cursando', 'aprobado', 'reprobado', 'inactivo', 'retirado'])->default('cursando');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curso_user', function (Blueprint $table) {
            $table->dropColumn(['nota_final', 'faltas_consecutivas', 'total_faltas', 'estado']);
        });
    }
};
