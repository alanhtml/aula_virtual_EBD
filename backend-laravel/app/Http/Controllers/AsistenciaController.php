<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AsistenciaController extends Controller
{
    /**
     * Registra la asistencia de varios estudiantes a la vez.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'fecha' => 'required|date',
            'asistencias' => 'required|array',
            'asistencias.*.user_id' => 'required|exists:users,id',
            'asistencias.*.estado' => 'required|in:presente,ausente,justificado',
            'asistencias.*.observaciones' => 'nullable|string',
        ]);

        $cursoId = $validated['curso_id'];
        $fecha = $validated['fecha'];
        $registros = [];

        DB::transaction(function () use ($validated, $cursoId, $fecha, &$registros) {
            foreach ($validated['asistencias'] as $item) {
                $asistencia = Asistencia::updateOrCreate(
                    [
                        'user_id' => $item['user_id'],
                        'curso_id' => $cursoId,
                        'fecha' => $fecha,
                    ],
                    [
                        'estado' => $item['estado'],
                        'observaciones' => $item['observaciones'] ?? null,
                    ]
                );

                // Lógica de faltas consecutivas en la tabla pivote curso_user
                $user = User::find($item['user_id']);
                $pivot = $user->cursos()->where('curso_id', $cursoId)->first()->pivot;

                if ($item['estado'] === 'ausente') {
                    $pivot->faltas_consecutivas += 1;
                    $pivot->total_faltas += 1;
                } else if ($item['estado'] === 'presente') {
                    $pivot->faltas_consecutivas = 0;
                }

                // Si tiene 3 faltas consecutivas, se pone inactivo
                if ($pivot->faltas_consecutivas >= 3) {
                    $pivot->estado = 'inactivo';
                }

                $pivot->save();
                $registros[] = $asistencia;
            }
        });

        return response()->json([
            'message' => 'Asistencias registradas y estados actualizados.',
            'data' => $registros
        ]);
    }

    /**
     * Obtiene la asistencia de un curso en una fecha específica.
     */
    public function getByCurso(Request $request, $cursoId)
    {
        $fecha = $request->query('fecha', date('Y-m-d'));
        $asistencias = Asistencia::where('curso_id', $cursoId)
            ->where('fecha', $fecha)
            ->get();

        return response()->json($asistencias);
    }
}
