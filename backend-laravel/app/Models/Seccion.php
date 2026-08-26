<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    use HasFactory;

    protected $fillable = ['titulo', 'descripcion', 'orden', 'curso_id'];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function materiales()
    {
        return $this->hasMany(Material::class)->orderBy('created_at', 'asc');
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class)->orderBy('created_at', 'asc');
    }
}
