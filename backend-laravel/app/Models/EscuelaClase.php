<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EscuelaClase extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'rango_edad',
        'descripcion',
        'docente_id',
    ];

    public function docente()
    {
        return $this->belongsTo(User::class, 'docente_id');
    }

    public function estudiantes()
    {
        return $this->hasMany(EscuelaClaseEstudiante::class);
    }
}
