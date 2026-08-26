<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        if ($cursoId) {
            return Tarea::where('curso_id', $cursoId)->get();
        }
        return Tarea::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'fecha_entrega' => 'nullable|date',
            'puntos' => 'nullable|integer|min:0',
            'curso_id' => 'required|exists:cursos,id',
            'seccion_id' => 'nullable|exists:seccions,id',
        ]);

        return Tarea::create($validated);
    }

    public function show(Tarea $tarea)
    {
        return $tarea->load('curso');
    }

    public function update(Request $request, Tarea $tarea)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'contenido' => 'nullable|string',
            'fecha_entrega' => 'nullable|date',
        ]);

        $tarea->update($validated);
        return $tarea;
    }

    public function destroy(Tarea $tarea)
    {
        $tarea->delete();
        return response()->noContent();
    }
}
