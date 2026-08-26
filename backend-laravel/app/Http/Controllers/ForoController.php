<?php

namespace App\Http\Controllers;

use App\Models\ForoMensaje;
use Illuminate\Http\Request;

class ForoController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        $foroId = $request->query('foro_id');

        $query = ForoMensaje::where('curso_id', $cursoId);

        if ($foroId) {
            $query->where('foro_id', $foroId);
        } else {
            $query->whereNull('foro_id');
        }

        return response()->json(
            $query->with('user')
                ->orderBy('created_at', 'asc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contenido' => 'required|string',
            'curso_id' => 'required|exists:cursos,id',
            'foro_id' => 'nullable|exists:foros,id',
        ]);

        $mensaje = ForoMensaje::create([
            'contenido' => $validated['contenido'],
            'curso_id' => $validated['curso_id'],
            'foro_id' => $validated['foro_id'] ?? null,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($mensaje->load('user'), 201);
    }
}
