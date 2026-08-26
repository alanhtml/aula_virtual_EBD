<?php

namespace App\Http\Controllers;

use App\Models\EscuelaClase;
use App\Models\EscuelaClaseEstudiante;
use Illuminate\Http\Request;

class EscuelaClaseController extends Controller
{
    public function index()
    {
        return EscuelaClase::with(['docente', 'estudiantes'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'rango_edad' => 'required|string',
            'descripcion' => 'nullable|string',
            'docente_id' => 'nullable|exists:users,id',
        ]);

        $clase = EscuelaClase::create($validated);
        return response()->json($clase, 201);
    }

    public function show(EscuelaClase $escuelaClase)
    {
        return $escuelaClase->load(['docente', 'estudiantes']);
    }

    public function update(Request $request, $id)
    {
        $clase = EscuelaClase::findOrFail($id);
        $validated = $request->validate([
            'nombre' => 'sometimes|string',
            'rango_edad' => 'sometimes|string',
            'descripcion' => 'nullable|string',
            'docente_id' => 'nullable|exists:users,id',
        ]);

        $clase->update($validated);
        return response()->json($clase);
    }

    public function destroy($id)
    {
        $clase = EscuelaClase::findOrFail($id);
        $clase->delete();
        return response()->json(null, 204);
    }

    public function agregarEstudiante(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre_estudiante' => 'required|string',
            'edad' => 'required|integer',
        ]);

        $estudiante = EscuelaClaseEstudiante::create([
            'escuela_clase_id' => $id,
            'nombre_estudiante' => $validated['nombre_estudiante'],
            'edad' => $validated['edad'],
        ]);

        return response()->json($estudiante, 201);
    }

    public function eliminarEstudiante($claseId, $estudianteId)
    {
        $estudiante = EscuelaClaseEstudiante::where('escuela_clase_id', $claseId)
            ->where('id', $estudianteId)
            ->firstOrFail();

        $estudiante->delete();
        return response()->json(null, 204);
    }
}
