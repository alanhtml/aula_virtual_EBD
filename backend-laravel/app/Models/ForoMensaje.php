<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForoMensaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenido',
        'foro_id',
        'user_id',
        'curso_id',
    ];

    public function foro()
    {
        return $this->belongsTo(Foro::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }
}
