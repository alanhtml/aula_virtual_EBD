<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Periodo;
use App\Models\ModuloMaster;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Curso::with(['docente', 'docentes', 'moduloMaster', 'periodo']);

        if ($user && $user->role === 'docentes') {
            $query->where(function($q) use ($user) {
                $q->where('docente_id', $user->id)
                  ->orWhereHas('docentes', function($sq) use ($user) {
                      $sq->where('users.id', $user->id);
                  });
            });
        } elseif ($user && $user->role === 'estudiantes') {
            $query->whereHas('estudiantes', function($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        // Director y Secretaria ven todos
        return response()->json($query->get());
    }

    public function catalog()
    {
        $cursos = Curso::orderBy('nivel', 'asc')->get()->unique('nivel')->values();
        return response()->json($cursos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'nivel'       => 'required|in:101,201,301,401,501',
            'semestre'    => 'nullable|string',
            'horario'     => 'required|string',
            'descripcion' => 'nullable|string',
            'codigo'      => 'required|string|unique:cursos',
            'docente_id'  => 'nullable|exists:users,id',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'   => 'nullable|date',
            'docentes'    => 'nullable|array',
            'docentes.*'  => 'exists:users,id',
            'periodo_id'  => 'nullable|exists:periodos,id',
        ]);

        $curso = Curso::create($validated);

        if ($request->has('docentes')) {
            $curso->docentes()->sync($request->docentes);
        }

        return response()->json($curso->load(['docentes', 'periodo']), 201);
    }

    public function show(Curso $curso)
    {
        return response()->json($curso->load([
            'docente',
            'docentes',
            'estudiantes',
            'periodo',
            'moduloMaster.secciones.materiales',
            'moduloMaster.secciones.tareas',
            'secciones.materiales',
            'secciones.tareas',
        ]));
    }

    public function inscribirEstudiantes(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'estudiantes'   => 'required|array',
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
                $nivelesMap     = [201 => '101', 301 => '201', 401 => '301', 501 => '401'];
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
            'message'     => 'Estudiantes inscritos correctamente',
            'estudiantes' => $curso->estudiantes,
        ]);
    }

    public function update(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'nombre'      => 'sometimes|required|string|max:255',
            'nivel'       => 'sometimes|required|in:101,201,301,401,501',
            'semestre'    => 'sometimes|nullable|string',
            'horario'     => 'sometimes|required|string',
            'descripcion' => 'nullable|string',
            'codigo'      => 'sometimes|required|string|unique:cursos,codigo,' . $curso->id,
            'docente_id'  => 'nullable|exists:users,id',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'   => 'nullable|date',
            'docentes'    => 'nullable|array',
            'docentes.*'  => 'exists:users,id',
            'periodo_id'  => 'nullable|exists:periodos,id',
        ]);

        $curso->update($validated);

        if ($request->has('docentes')) {
            $curso->docentes()->sync($request->docentes);
        }

        return response()->json($curso->load(['docentes', 'periodo']));
    }

    public function destroy(Curso $curso)
    {
        $curso->delete();
        return response()->json(null, 204);
    }

    public function calificarEstudiante(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'user_id'          => 'required|exists:users,id',
            'nota_final'       => 'required|numeric|min:0|max:100',
            'retroalimentacion' => 'nullable|string',
            'estado'           => 'required|in:cursando,aprobado,reprobado,inactivo,retirado',
        ]);

        $curso->estudiantes()->updateExistingPivot($validated['user_id'], [
            'nota_final'        => $validated['nota_final'],
            'retroalimentacion' => $validated['retroalimentacion'],
            'estado'            => $validated['estado'],
        ]);

        $estudiante = \App\Models\User::find($validated['user_id']);

        // Lógica de Promoción Automática: Si aprueba con >= 61, sube su nivel_actual
        if ($validated['estado'] === 'aprobado' && $validated['nota_final'] >= 61) {
            $niveles  = ['101', '201', '301', '401', '501'];
            $posActual = array_search($curso->nivel, $niveles);

            if ($posActual !== false && isset($niveles[$posActual + 1])) {
                $siguienteNivel = $niveles[$posActual + 1];
                if ((int)$siguienteNivel > (int)$estudiante->nivel_actual) {
                    $estudiante->update(['nivel_actual' => $siguienteNivel]);
                }
            }
        }

        return response()->json([
            'message'            => 'Calificación registrada y nivel actualizado si corresponde',
            'estudiante'         => $curso->estudiantes()->where('users.id', $validated['user_id'])->first(),
            'nivel_actual_alumno' => $estudiante->nivel_actual,
        ]);
    }

    public function historialAcademico()
    {
        $user = auth()->user();
        if ($user->role !== 'estudiantes') {
            return response()->json(['message' => 'Solo estudiantes pueden ver su historial'], 403);
        }

        $historial = $user->cursos()->with(['docente', 'docentes', 'periodo'])->get();
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
                    'nombre'   => $estudiante->name,
                    'ci'       => $estudiante->ci,
                    'email'    => $estudiante->email,
                    'telefono' => $estudiante->telefono,
                    'cursos'   => $estudiante->cursos->map(function($c) {
                        return [
                            'modulo' => $c->nombre,
                            'codigo' => $c->codigo,
                            'nota'   => $c->pivot->nota_final,
                            'estado' => $c->pivot->estado,
                        ];
                    }),
                ];
            });

        return response()->json($reporte);
    }

    public function aperturaMasiva(Request $request)
    {
        $validated = $request->validate([
            'periodo' => 'required|in:PI,PII,PIII',
            'año'     => 'required|integer|min:2024|max:2099',
        ]);

        $periodoNombre = $validated['periodo'];
        $año           = $validated['año'];

        // 1. Buscar o crear el registro de Periodo (el ciclo lectivo)
        $periodoObj = Periodo::firstOrCreate(
            ['nombre' => $periodoNombre, 'año' => $año],
            [
                'activo'       => true,
                'fecha_inicio' => null,
                'fecha_fin'    => null,
            ]
        );

        $niveles = ['101', '201', '301', '401', '501'];
        $nombres = [
            '101' => 'Fundamentos de la Fe',
            '201' => 'Historia del Cristianismo',
            '301' => 'Hermenéutica Bíblica',
            '401' => 'Teología Sistemática',
            '501' => 'Liderazgo y Misiones',
        ];

        $cursosCreados = [];

        foreach ($niveles as $nivel) {
            // Código legible, pero el filtrado real ya usa periodo_id (no el texto)
            $codigo = "{$nivel}-{$periodoNombre}-{$año}";

            // 2. Asegurar que exista el Módulo Maestro (El Molde permanente)
            $master = ModuloMaster::firstOrCreate(
                ['nivel' => $nivel],
                [
                    'nombre'      => $nombres[$nivel],
                    'descripcion' => "Contenido maestro para el Módulo {$nivel}.",
                ]
            );

            // 3. Crear la Instancia de Cursada vinculada al Maestro Y al Periodo por FK
            //    Unicidad: mismo ModuloMaster + mismo Periodo → nunca duplicar
            $curso = Curso::firstOrCreate(
                ['modulo_master_id' => $master->id, 'periodo_id' => $periodoObj->id],
                [
                    'nombre'           => $nombres[$nivel],
                    'nivel'            => $nivel,
                    'semestre'         => "{$periodoNombre} - {$año}",
                    'horario'          => 'Domingos 08:00 - 12:00',
                    'descripcion'      => "Instancia del Módulo {$nivel} para el periodo {$periodoNombre} {$año}.",
                    'codigo'           => $codigo,
                    'fecha_inicio'     => $periodoObj->fecha_inicio,
                    'fecha_fin'        => $periodoObj->fecha_fin,
                    'modulo_master_id' => $master->id,
                    'periodo_id'       => $periodoObj->id,
                ]
            );

            $cursosCreados[] = $curso->load('periodo');
        }

        return response()->json([
            'message' => 'Apertura masiva completada. Módulos vinculados al periodo por FK.',
            'periodo' => $periodoObj,
            'cursos'  => $cursosCreados,
        ]);
    }

    public function cursoDisponibleInscripcion()
    {
        $user = auth()->user();
        if ($user->role !== 'estudiantes') {
            return response()->json(['disponible' => false]);
        }

        // Si ya está cursando, no necesita auto-inscribirse
        $cursoActivo = $user->cursos()->wherePivot('estado', 'cursando')->first();
        if ($cursoActivo) {
            return response()->json([
                'disponible' => false,
                'ya_inscrito' => true,
                'curso_actual' => $cursoActivo->load('periodo')
            ]);
        }

        $hoy = \Carbon\Carbon::today();
        $periodoActivo = Periodo::where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->first();

        if (!$periodoActivo) {
            $periodoActivo = Periodo::where('activo', true)->orderBy('año', 'desc')->orderBy('nombre', 'desc')->first();
        }

        if (!$periodoActivo) {
            return response()->json(['disponible' => false, 'message' => 'No hay periodo activo para inscripciones']);
        }

        $nivelObjetivo = $user->nivel_actual ?? '101';
        $nombres = [
            '101' => 'Fundamentos de la Fe',
            '201' => 'Historia del Cristianismo',
            '301' => 'Hermenéutica Bíblica',
            '401' => 'Teología Sistemática',
            '501' => 'Liderazgo y Misiones',
        ];

        // Buscar curso del periodo activo
        $curso = Curso::where('nivel', $nivelObjetivo)
            ->where('periodo_id', $periodoActivo->id)
            ->with(['docente', 'docentes', 'periodo'])
            ->first();

        return response()->json([
            'disponible' => true,
            'nivel' => $nivelObjetivo,
            'nombre_modulo' => $nombres[$nivelObjetivo] ?? "Módulo {$nivelObjetivo}",
            'periodo' => "{$periodoActivo->nombre} - {$periodoActivo->año}",
            'periodo_id' => $periodoActivo->id,
            'curso_id' => $curso ? $curso->id : null,
            'docente' => $curso && $curso->docente ? $curso->docente->name : 'Profesor asignado',
            'horario' => $curso ? $curso->horario : 'Domingos 08:00 - 12:00',
            'fecha_inicio' => $periodoActivo->fecha_inicio,
            'fecha_fin' => $periodoActivo->fecha_fin,
        ]);
    }

    public function autoInscribir(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'estudiantes') {
            return response()->json(['message' => 'Solo estudiantes pueden auto-inscribirse'], 403);
        }

        $hoy = \Carbon\Carbon::today();
        $periodoActivo = Periodo::where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->first();

        if (!$periodoActivo) {
            $periodoActivo = Periodo::where('activo', true)->orderBy('año', 'desc')->orderBy('nombre', 'desc')->first();
        }

        if (!$periodoActivo) {
            return response()->json(['message' => 'No hay un ciclo lectivo activo en este momento.'], 422);
        }

        $cursoActivo = $user->cursos()->wherePivot('estado', 'cursando')->first();
        if ($cursoActivo) {
            return response()->json([
                'message' => "Ya te encuentras cursando el módulo {$cursoActivo->nombre} ({$cursoActivo->codigo}).",
                'curso' => $cursoActivo
            ], 422);
        }

        $nivelObjetivo = $user->nivel_actual ?? '101';

        // Validar correlatividad si nivel > 101
        if ((int)$nivelObjetivo > 101) {
            $nivelesMap = [201 => '101', 301 => '201', 401 => '301', 501 => '401'];
            $nivelPrevioReq = $nivelesMap[(int)$nivelObjetivo] ?? '101';

            $aprobadoPrevio = $user->cursos()
                ->where('nivel', $nivelPrevioReq)
                ->wherePivot('estado', 'aprobado')
                ->exists();

            if (!$aprobadoPrevio) {
                return response()->json([
                    'message' => "Debes tener aprobado el Módulo {$nivelPrevioReq} para ingresar al Módulo {$nivelObjetivo}."
                ], 422);
            }
        }

        $nombres = [
            '101' => 'Fundamentos de la Fe',
            '201' => 'Historia del Cristianismo',
            '301' => 'Hermenéutica Bíblica',
            '401' => 'Teología Sistemática',
            '501' => 'Liderazgo y Misiones',
        ];

        $master = ModuloMaster::firstOrCreate(
            ['nivel' => $nivelObjetivo],
            [
                'nombre' => $nombres[$nivelObjetivo] ?? "Módulo {$nivelObjetivo}",
                'descripcion' => "Contenido maestro para el Módulo {$nivelObjetivo}."
            ]
        );

        $curso = Curso::firstOrCreate(
            ['modulo_master_id' => $master->id, 'periodo_id' => $periodoActivo->id],
            [
                'nombre' => $nombres[$nivelObjetivo] ?? "Módulo {$nivelObjetivo}",
                'nivel' => $nivelObjetivo,
                'semestre' => "{$periodoActivo->nombre} - {$periodoActivo->año}",
                'horario' => 'Domingos 08:00 - 12:00',
                'descripcion' => "Instancia del Módulo {$nivelObjetivo} para el periodo {$periodoActivo->nombre} {$periodoActivo->año}.",
                'codigo' => "{$nivelObjetivo}-{$periodoActivo->nombre}-{$periodoActivo->año}",
                'modulo_master_id' => $master->id,
                'periodo_id' => $periodoActivo->id,
                'fecha_inicio' => $periodoActivo->fecha_inicio,
                'fecha_fin' => $periodoActivo->fecha_fin,
            ]
        );

        $user->cursos()->syncWithoutDetaching([
            $curso->id => [
                'estado' => 'cursando',
                'nota_final' => 0,
            ]
        ]);

        return response()->json([
            'message' => "¡Inscripción confirmada exitosamente en el Módulo {$nivelObjetivo}!",
            'curso' => $curso->load(['docente', 'docentes', 'periodo'])
        ], 200);
    }
}
