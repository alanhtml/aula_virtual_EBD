<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;

class PeriodoController extends Controller
{
    public function index()
    {
        return Periodo::orderBy('año', 'desc')->orderBy('nombre', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|in:PI,PII,PIII',
            'año' => 'required|integer|min:2024',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
        ]);

        $periodo = Periodo::updateOrCreate(
            ['nombre' => $validated['nombre'], 'año' => $validated['año']],
            $validated
        );

        return response()->json($periodo, 201);
    }

    public function update(Request $request, $id)
    {
        $periodo = Periodo::findOrFail($id);
        $validated = $request->validate([
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'activo' => 'boolean'
        ]);

        $periodo->update($validated);
        return response()->json($periodo);
    }

    public function show($nombre, $año)
    {
        $periodo = Periodo::where('nombre', $nombre)->where('año', $año)->first();
        return response()->json($periodo);
    }
}
