<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        $masterId = $request->query('modulo_master_id');

        $query = Tarea::query();

        if ($cursoId) {
            $query->where('curso_id', $cursoId);
        }

        if ($masterId) {
            $query->where('modulo_master_id', $masterId);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'fecha_entrega' => 'nullable|date',
            'puntos' => 'nullable|integer|min:0',
            'curso_id' => 'nullable|exists:cursos,id',
            'modulo_master_id' => 'nullable|exists:modulo_masters,id',
            'seccion_id' => 'nullable|exists:seccions,id',
        ]);

        if (!$request->curso_id && !$request->modulo_master_id) {
            return response()->json(['message' => 'Debe proporcionar un curso_id o un modulo_master_id'], 422);
        }

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
