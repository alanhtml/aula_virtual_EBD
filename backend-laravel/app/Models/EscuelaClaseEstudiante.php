<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EscuelaClaseEstudiante extends Model
{
    use HasFactory;

    protected $table = 'escuela_clase_estudiante';

    protected $fillable = [
        'escuela_clase_id',
        'nombre_estudiante',
        'edad',
    ];

    public function clase()
    {
        return $this->belongsTo(EscuelaClase::class, 'escuela_clase_id');
    }
}
