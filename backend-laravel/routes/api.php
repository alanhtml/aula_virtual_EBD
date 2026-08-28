<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ForoController;
use App\Http\Controllers\ForoItemController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PeriodoController;
use App\Http\Controllers\EscuelaClaseController;
use App\Http\Controllers\SeccionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/mensaje', function () {
    return response()->json([
        'mensaje' => '¡Conexión exitosa desde el Backend de Laravel!',
        'proyecto' => 'Sistema de Aula Virtual'
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::get('/cursos/catalog', [CursoController::class, 'catalog']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/server-info', [DashboardController::class, 'serverInfo']);

    // Gestión de Cursos
    Route::post('cursos/auto-inscribir', [CursoController::class, 'autoInscribir']);
    Route::get('cursos/disponible-inscripcion', [CursoController::class, 'cursoDisponibleInscripcion']);
    Route::apiResource('cursos', CursoController::class);
    Route::post('cursos/{curso}/inscribir', [CursoController::class, 'inscribirEstudiantes']);
    Route::post('cursos/{curso}/calificar', [CursoController::class, 'calificarEstudiante']);
    Route::get('reporte-general', [CursoController::class, 'reporteGeneral']);
    Route::get('historial-academico', [CursoController::class, 'historialAcademico']);
    Route::post('apertura-masiva', [CursoController::class, 'aperturaMasiva']);

    // Gestión de Periodos
    Route::get('periodos', [PeriodoController::class, 'index']);
    Route::get('periodos/activo', [PeriodoController::class, 'activo']); // Detecta el periodo vigente por fecha
    Route::post('periodos/cerrar-ciclo', [PeriodoController::class, 'cerrarCiclo']);
    Route::post('periodos', [PeriodoController::class, 'store']);
    Route::put('periodos/{id}', [PeriodoController::class, 'update']);
    Route::get('periodos/{nombre}/{año}', [PeriodoController::class, 'show']);

    // Gestión de Usuarios
    Route::apiResource('users', UserController::class);

    // Control de Asistencia
    Route::post('asistencias', [AsistenciaController::class, 'store']);
    Route::get('asistencias/curso/{cursoId}', [AsistenciaController::class, 'getByCurso']);

    // Secciones de Curso
    Route::apiResource('secciones', SeccionController::class);

    // Escuela Bíblica (Clases por edades)
    Route::apiResource('escuela-clases', EscuelaClaseController::class);
    Route::post('escuela-clases/{id}/estudiantes', [EscuelaClaseController::class, 'agregarEstudiante']);
    Route::delete('escuela-clases/{claseId}/estudiantes/{estudianteId}', [EscuelaClaseController::class, 'eliminarEstudiante']);

    // Gestión de Materiales
    Route::apiResource('materiales', MaterialController::class);

    // Foro
    Route::get('foro', [ForoController::class, 'index']);
    Route::post('foro', [ForoController::class, 'store']);
    Route::apiResource('foros-items', ForoItemController::class);

    // Tareas y Entregas
    Route::apiResource('tareas', TareaController::class);
    Route::apiResource('entregas', EntregaController::class);
    Route::post('entregas/{entrega}/calificar', [EntregaController::class, 'calificar']);
    Route::get('mis-calificaciones', [EntregaController::class, 'misCalificaciones']);
});
