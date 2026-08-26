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
        Schema::table('materials', function (Blueprint $table) {
            $table->foreignId('seccion_id')->nullable()->constrained('seccions')->onDelete('cascade');
        });

        Schema::table('tareas', function (Blueprint $table) {
            $table->foreignId('seccion_id')->nullable()->constrained('seccions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropForeign(['seccion_id']);
            $table->dropColumn('seccion_id');
        });

        Schema::table('tareas', function (Blueprint $table) {
            $table->dropForeign(['seccion_id']);
            $table->dropColumn('seccion_id');
        });
    }
};
