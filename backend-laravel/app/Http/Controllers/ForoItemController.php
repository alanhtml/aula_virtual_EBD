<?php

namespace App\Http\Controllers;

use App\Models\Foro;
use Illuminate\Http\Request;

class ForoItemController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        return response()->json(Foro::where('curso_id', $cursoId)->orderBy('orden')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'curso_id' => 'required|exists:cursos,id',
            'seccion_id' => 'nullable|exists:seccions,id',
        ]);

        $foro = Foro::create($validated);

        return response()->json($foro, 201);
    }

    public function show(Foro $foro)
    {
        return response()->json($foro->load('mensajes.user'));
    }

    public function update(Request $request, Foro $foro)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'sometimes|integer',
            'seccion_id' => 'nullable|exists:seccions,id',
        ]);

        $foro->update($validated);

        return response()->json($foro);
    }

    public function destroy(Foro $foro)
    {
        $foro->delete();
        return response()->json(null, 204);
    }
}
