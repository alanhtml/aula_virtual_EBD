<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foro extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'orden',
        'curso_id',
        'seccion_id',
    ];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function seccion()
    {
        return $this->belongsTo(Seccion::class);
    }

    public function mensajes()
    {
        return $this->hasMany(ForoMensaje::class);
    }
}
