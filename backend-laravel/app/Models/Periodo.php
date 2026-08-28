<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periodo extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'año',
        'fecha_inicio',
        'fecha_fin',
        'activo',
    ];

    public function cursos()
    {
        return $this->hasMany(Curso::class);
    }
}
