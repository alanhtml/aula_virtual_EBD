<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'nivel',
        'semestre',
        'horario',
        'descripcion',
        'codigo',
        'docente_id',
        'fecha_inicio',
        'fecha_fin',
        'modulo_master_id',
        'periodo_id',
    ];

    public function periodo()
    {
        return $this->belongsTo(Periodo::class);
    }

    public function moduloMaster()
    {
        return $this->belongsTo(ModuloMaster::class);
    }

    public function docentes()
    {
        return $this->belongsToMany(User::class, 'curso_docente');
    }

    public function docente()
    {
        return $this->belongsTo(User::class, 'docente_id');
    }

    public function estudiantes()
    {
        return $this->belongsToMany(User::class);
    }

    public function materiales()
    {
        return $this->hasMany(Material::class);
    }

    public function secciones()
    {
        return $this->hasMany(Seccion::class)->orderBy('orden', 'asc');
    }
}

