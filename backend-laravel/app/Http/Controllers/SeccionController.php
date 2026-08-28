<?php

namespace App\Http\Controllers;

use App\Models\Seccion;
use Illuminate\Http\Request;

class SeccionController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        $masterId = $request->query('modulo_master_id');

        $query = Seccion::query();

        if ($cursoId) {
            $curso = \App\Models\Curso::find($cursoId);
            if ($curso && $curso->modulo_master_id) {
                $query->where(function($q) use ($cursoId, $curso) {
                    $q->where('curso_id', $cursoId)
                      ->orWhere('modulo_master_id', $curso->modulo_master_id);
                });
            } else {
                $query->where('curso_id', $cursoId);
            }
        } elseif ($masterId) {
            $query->where('modulo_master_id', $masterId);
        }

        return response()->json($query->orderBy('orden', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'curso_id' => 'nullable|exists:cursos,id',
            'modulo_master_id' => 'nullable|exists:modulo_masters,id',
            'orden' => 'nullable|integer'
        ]);

        if (!$request->curso_id && !$request->modulo_master_id) {
            return response()->json(['message' => 'Debe proporcionar un curso_id o un modulo_master_id'], 422);
        }

        $seccion = Seccion::create($validated);
        return response()->json($seccion, 201);
    }

    public function update(Request $request, Seccion $seccion)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer'
        ]);

        $seccion->update($validated);
        return response()->json($seccion);
    }

    public function destroy(Seccion $seccion)
    {
        $seccion->delete();
        return response()->json(null, 204);
    }
}
