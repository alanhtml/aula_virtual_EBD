<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega periodo_id a la tabla cursos para ligar cada instancia
     * de cursada a un Periodo académico real (PI, PII, PIII) en lugar de
     * tenerlo codificado como texto dentro del campo 'codigo'.
     */
    public function up(): void
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->foreignId('periodo_id')
                ->nullable()
                ->after('modulo_master_id')
                ->constrained('periodos')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->dropForeign(['periodo_id']);
            $table->dropColumn('periodo_id');
        });
    }
};
