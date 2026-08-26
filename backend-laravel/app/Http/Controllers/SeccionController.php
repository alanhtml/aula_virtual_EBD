<?php

namespace App\Http\Controllers;

use App\Models\Seccion;
use Illuminate\Http\Request;

class SeccionController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        if ($cursoId) {
            return response()->json(Seccion::where('curso_id', $cursoId)->orderBy('orden', 'asc')->get());
        }
        return response()->json(Seccion::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'curso_id' => 'required|exists:cursos,id',
            'orden' => 'nullable|integer'
        ]);

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
