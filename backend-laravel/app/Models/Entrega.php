<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entrega extends Model
{
    protected $fillable = [
        'tarea_id',
        'user_id',
        'comentario_estudiante',
        'archivo_url',
        'calificacion',
        'comentario_profesor',
        'fecha_entrega',
    ];

    public function tarea(): BelongsTo
    {
        return $this->belongsTo(Tarea::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
