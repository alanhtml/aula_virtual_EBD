<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tarea extends Model
{
    protected $fillable = [
        'titulo',
        'contenido',
        'fecha_entrega',
        'puntos',
        'curso_id',
        'seccion_id',
        'modulo_master_id',
    ];

    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    public function moduloMaster(): BelongsTo
    {
        return $this->belongsTo(ModuloMaster::class);
    }

    public function seccion(): BelongsTo
    {
        return $this->belongsTo(Seccion::class);
    }

    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }
}
