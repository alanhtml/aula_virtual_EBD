<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // PI, PII, PIII
            $table->integer('año');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique(['nombre', 'año']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periodos');
    }
};
