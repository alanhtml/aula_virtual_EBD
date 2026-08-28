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
            'activo' => 'boolean',
            'nombre' => 'sometimes|string|in:PI,PII,PIII',
            'año' => 'sometimes|integer|min:2024',
        ]);

        $periodo->update($validated);
        return response()->json($periodo);
    }

    public function show($nombre, $año)
    {
        $periodo = Periodo::where('nombre', $nombre)->where('año', $año)->first();
        return response()->json($periodo);
    }

    public function cerrarCiclo(Request $request)
    {
        $hoy = Carbon::today();
        $periodoId = $request->input('periodo_id');

        if ($periodoId) {
            $periodo = Periodo::find($periodoId);
        } else {
            // Lógica inteligente: Buscar el periodo que terminó más recientemente pero sigue ACTIVO
            // O el que está por terminar en los próximos 15 días.
            $periodo = Periodo::where('activo', true)
                ->where('fecha_inicio', '<=', $hoy)
                ->orderBy('fecha_fin', 'asc') // El que termina primero
                ->first();
        }

        if (!$periodo) {
            return response()->json(['message' => 'No se encontró un periodo activo elegible para cierre.'], 404);
        }

        // 2. Procesar todos los cursos de este periodo
        $cursos = \App\Models\Curso::where('periodo_id', $periodo->id)->with('estudiantes')->get();

        $promocionados = 0;
        $procesados = 0;

        foreach ($cursos as $curso) {
            foreach ($curso->estudiantes as $estudiante) {
                $pivot = $estudiante->pivot;

                // Solo procesamos a los que están "cursando"
                if ($pivot->estado === 'cursando') {
                    $nota = $pivot->nota_final ?? 0;
                    $nuevoEstado = $nota >= 61 ? 'aprobado' : 'reprobado';

                    // Actualizar el estado en el curso actual
                    $curso->estudiantes()->updateExistingPivot($estudiante->id, [
                        'estado' => $nuevoEstado
                    ]);

                    // Si aprobó, subir nivel_actual si no es el máximo
                    if ($nuevoEstado === 'aprobado') {
                        $niveles = ['101', '201', '301', '401', '501'];
                        $posActual = array_search($curso->nivel, $niveles);

                        if ($posActual !== false && isset($niveles[$posActual + 1])) {
                            $siguienteNivel = $niveles[$posActual + 1];

                            // Solo subir si el nivel del curso es igual o mayor a su nivel_actual registrado
                            // (Evita bajar de nivel si por alguna razón cursa algo menor)
                            if ((int)$siguienteNivel > (int)$estudiante->nivel_actual) {
                                $estudiante->update(['nivel_actual' => $siguienteNivel]);
                                $promocionados++;
                            }
                        }
                    }
                    $procesados++;
                }
            }
        }

        // 3. Marcar periodo como inactivo
        $periodo->update(['activo' => false]);

        return response()->json([
            'message' => "Ciclo {$periodo->nombre}-{$periodo->año} cerrado exitosamente.",
            'periodo_id' => $periodo->id,
            'estudiantes_procesados' => $procesados,
            'estudiantes_promocionados' => $promocionados
        ]);
    }
}

