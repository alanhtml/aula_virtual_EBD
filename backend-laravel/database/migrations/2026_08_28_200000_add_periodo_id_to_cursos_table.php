<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('cursos', 'periodo_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->foreignId('periodo_id')
                    ->nullable()
                    ->after('modulo_master_id')
                    ->constrained('periodos')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('cursos', 'periodo_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->dropForeign(['periodo_id']);
                $table->dropColumn('periodo_id');
            });
        }
    }
};
