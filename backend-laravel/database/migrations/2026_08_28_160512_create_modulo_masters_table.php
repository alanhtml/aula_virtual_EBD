<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('modulo_masters')) {
            Schema::create('modulo_masters', function (Blueprint $table) {
                $table->id();
                $table->string('nombre');
                $table->enum('nivel', ['101', '201', '301', '401', '501'])->unique();
                $table->text('descripcion')->nullable();
                $table->timestamps();
            });
        }

        // Modificar tabla cursos para referenciar al maestro
        if (!Schema::hasColumn('cursos', 'modulo_master_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->foreignId('modulo_master_id')->nullable()->after('id')->constrained('modulo_masters')->onDelete('cascade');
            });
        }

        // Modificar secciones para que puedan pertenecer a un maestro
        if (!Schema::hasColumn('seccions', 'modulo_master_id')) {
            Schema::table('seccions', function (Blueprint $table) {
                $table->foreignId('modulo_master_id')->nullable()->after('curso_id')->constrained('modulo_masters')->onDelete('cascade');
            });
        }

        // Modificar materiales para que puedan pertenecer a un maestro
        if (!Schema::hasColumn('materials', 'modulo_master_id')) {
            Schema::table('materials', function (Blueprint $table) {
                $table->foreignId('modulo_master_id')->nullable()->after('curso_id')->constrained('modulo_masters')->onDelete('cascade');
            });
        }

        // Modificar tareas para que puedan pertenecer a un maestro
        if (!Schema::hasColumn('tareas', 'modulo_master_id')) {
            Schema::table('tareas', function (Blueprint $table) {
                $table->foreignId('modulo_master_id')->nullable()->after('curso_id')->constrained('modulo_masters')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('tareas', 'modulo_master_id')) {
            Schema::table('tareas', function (Blueprint $table) {
                $table->dropForeign(['modulo_master_id']);
                $table->dropColumn('modulo_master_id');
            });
        }
        if (Schema::hasColumn('materials', 'modulo_master_id')) {
            Schema::table('materials', function (Blueprint $table) {
                $table->dropForeign(['modulo_master_id']);
                $table->dropColumn('modulo_master_id');
            });
        }
        if (Schema::hasColumn('seccions', 'modulo_master_id')) {
            Schema::table('seccions', function (Blueprint $table) {
                $table->dropForeign(['modulo_master_id']);
                $table->dropColumn('modulo_master_id');
            });
        }
        if (Schema::hasColumn('cursos', 'modulo_master_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->dropForeign(['modulo_master_id']);
                $table->dropColumn('modulo_master_id');
            });
        }
        Schema::dropIfExists('modulo_masters');
    }
};
