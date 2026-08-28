<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PeriodoController extends Controller
{
    public function index()
    {
        return Periodo::orderBy('año', 'desc')->orderBy('nombre', 'asc')->get();
    }

    /**
     * Devuelve el periodo vigente según la fecha actual.
     * Lógica de fallback:
     *   1. Busca el periodo cuyas fechas engloban HOY.
     *   2. Si no hay fechas configuradas, devuelve el marcado como activo=true más reciente.
     *   3. Si tampoco existe, devuelve null.
     */
    public function activo()
    {
        $hoy = Carbon::today();

        // 1. Buscar por rango de fechas
        $porFecha = Periodo::where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->orderBy('año', 'desc')
            ->orderBy('nombre', 'desc')
            ->first();

        if ($porFecha) {
            return response()->json($porFecha);
        }

        // 2. Fallback: el más reciente marcado como activo
        $activo = Periodo::where('activo', true)
            ->orderBy('año', 'desc')
            ->orderBy('nombre', 'desc')
            ->first();

        return response()->json($activo);
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

