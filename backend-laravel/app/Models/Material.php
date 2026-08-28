<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'url',
        'curso_id',
        'seccion_id',
        'modulo_master_id',
    ];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function moduloMaster()
    {
        return $this->belongsTo(ModuloMaster::class);
    }

    public function seccion()
    {
        return $this->belongsTo(Seccion::class);
    }
}
