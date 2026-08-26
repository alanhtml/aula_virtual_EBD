<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Periodo;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Curso::with(['docente', 'docentes']);

        if ($user->role === 'docentes') {
            $query->where('docente_id', $user->id)
                  ->orWhereHas('docentes', function($q) use ($user) {
                      $q->where('users.id', $user->id);
                  });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'nivel' => 'required|in:101,201,301,401,501',
            'semestre' => 'required|string',
            'horario' => 'required|string',
            'descripcion' => 'nullable|string',
            'codigo' => 'required|string|unique:cursos',
            'docente_id' => 'nullable|exists:users,id',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'docentes' => 'nullable|array',
            'docentes.*' => 'exists:users,id',
        ]);

        $curso = Curso::create($validated);

        if ($request->has('docentes')) {
            $curso->docentes()->sync($request->docentes);
        }

        return response()->json($curso->load('docentes'), 201);
    }

    public function show(Curso $curso)
    {
        return response()->json($curso->load(['docente', 'docentes', 'estudiantes']));
    }

    public function inscribirEstudiantes(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'estudiantes' => 'required|array',
            'estudiantes.*' => 'exists:users,id',
        ]);

        foreach ($validated['estudiantes'] as $estudianteId) {
            $user = \App\Models\User::find($estudianteId);

            // Regla: No puede cursar dos módulos a la vez
            $cursoActivo = $user->cursos()->wherePivot('estado', 'cursando')->first();
            if ($cursoActivo && $cursoActivo->id != $curso->id) {
                return response()->json([
                    'message' => "El estudiante {$user->name} ya está cursando el módulo {$cursoActivo->codigo}."
                ], 422);
            }

            // Regla: Correlatividad
            $nivelActual = (int)$curso->nivel;
            if ($nivelActual > 101) {
                $nivelesMap = [201 => '101', 301 => '201', 401 => '301', 501 => '401'];
                $nivelPrevioReq = $nivelesMap[$nivelActual];

                $aprobadoPrevio = $user->cursos()
                    ->where('nivel', $nivelPrevioReq)
                    ->wherePivot('estado', 'aprobado')
                    ->exists();

                if (!$aprobadoPrevio) {
                    return response()->json([
                        'message' => "El estudiante {$user->name} no ha aprobado el nivel previo ({$nivelPrevioReq}) necesario para inscribirse al nivel {$nivelActual}."
                    ], 422);
                }
            }
        }

        $curso->estudiantes()->sync($validated['estudiantes']);

        return response()->json([
            'message' => 'Estudiantes inscritos correctamente',
            'estudiantes' => $curso->estudiantes
        ]);
    }

    public function update(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'nivel' => 'sometimes|required|in:101,201,301,401,501',
            'semestre' => 'sometimes|required|string',
            'horario' => 'sometimes|required|string',
            'descripcion' => 'nullable|string',
            'codigo' => 'sometimes|required|string|unique:cursos,codigo,' . $curso->id,
            'docente_id' => 'nullable|exists:users,id',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'docentes' => 'nullable|array',
            'docentes.*' => 'exists:users,id',
        ]);

        $curso->update($validated);

        if ($request->has('docentes')) {
            $curso->docentes()->sync($request->docentes);
        }

        return response()->json($curso->load('docentes'));
    }

    public function destroy(Curso $curso)
    {
        $curso->delete();
        return response()->json(null, 204);
    }

    public function calificarEstudiante(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nota_final' => 'required|numeric|min:0|max:100',
            'retroalimentacion' => 'nullable|string',
            'estado' => 'required|in:cursando,aprobado,reprobado,inactivo,retirado',
        ]);

        $curso->estudiantes()->updateExistingPivot($validated['user_id'], [
            'nota_final' => $validated['nota_final'],
            'retroalimentacion' => $validated['retroalimentacion'],
            'estado' => $validated['estado'],
        ]);

        return response()->json([
            'message' => 'Calificación registrada correctamente',
            'estudiante' => $curso->estudiantes()->where('users.id', $validated['user_id'])->first()
        ]);
    }

    public function historialAcademico()
    {
        $user = auth()->user();
        if ($user->role !== 'estudiantes') {
            return response()->json(['message' => 'Solo estudiantes pueden ver su historial'], 403);
        }

        $historial = $user->cursos()->with(['docente', 'docentes'])->get();

        return response()->json($historial);
    }

    public function reporteGeneral()
    {
        $user = auth()->user();
        if (!in_array($user->role, ['director', 'secretaria'])) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $reporte = \App\Models\User::where('role', 'estudiantes')
            ->with(['cursos' => function($q) {
                $q->withPivot('nota_final', 'estado', 'retroalimentacion');
            }])
            ->get()
            ->map(function($estudiante) {
                return [
                    'nombre' => $estudiante->name,
                    'ci' => $estudiante->ci,
                    'email' => $estudiante->email,
                    'telefono' => $estudiante->telefono,
                    'cursos' => $estudiante->cursos->map(function($c) {
                        return [
                            'modulo' => $c->nombre,
                            'codigo' => $c->codigo,
                            'nota' => $c->pivot->nota_final,
                            'estado' => $c->pivot->estado
                        ];
                    })
                ];
            });

        return response()->json($reporte);
    }

    public function aperturaMasiva(Request $request)
    {
        $validated = $request->validate([
            'periodo' => 'required|in:PI,PII,PIII',
            'año' => 'required|integer|min:2024|max:2099',
        ]);

        $periodo = $validated['periodo'];
        $año = $validated['año'];
        $niveles = ['101', '201', '301', '401', '501'];
        $nombres = [
            '101' => 'Fundamentos de la Fe',
            '201' => 'Historia del Cristianismo',
            '301' => 'Hermenéutica Bíblica',
            '401' => 'Teología Sistemática',
            '501' => 'Liderazgo y Misiones'
        ];

        $cursosCreados = [];

        $periodoObj = Periodo::where('nombre', $periodo)->where('año', $año)->first();
        $semestreText = 'Primer Semestre';
        if ($periodo === 'PII') $semestreText = 'Segundo Semestre';
        if ($periodo === 'PIII') $semestreText = 'Semestre Intensivo';

        foreach ($niveles as $nivel) {
            $codigo = "{$nivel}-{$periodo}-{$año}";

            // Solo crear si no existe
            $curso = Curso::firstOrCreate(
                ['codigo' => $codigo],
                [
                    'nombre' => $nombres[$nivel],
                    'nivel' => $nivel,
                    'semestre' => $semestreText,
                    'horario' => 'Domingos 08:00 - 12:00',
                    'descripcion' => "Módulo {$nivel} correspondiente al periodo {$periodo} del año {$año}.",
                    'fecha_inicio' => $periodoObj ? $periodoObj->fecha_inicio : null,
                    'fecha_fin' => $periodoObj ? $periodoObj->fecha_fin : null,
                ]
            );
            $cursosCreados[] = $curso;
        }

        return response()->json([
            'message' => 'Apertura masiva completada con éxito',
            'cursos' => $cursosCreados
        ]);
    }
}
