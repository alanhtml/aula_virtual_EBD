<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuloMaster extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'nivel', 'descripcion'];

    public function cursos()
    {
        return $this->hasMany(Curso::class);
    }

    public function secciones()
    {
        return $this->hasMany(Seccion::class)->orderBy('orden', 'asc');
    }

    public function materiales()
    {
        return $this->hasMany(Material::class);
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}
