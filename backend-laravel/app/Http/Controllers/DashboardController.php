<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Tarea;
use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = Auth::user();

        if ($user->role === 'director') {
            return response()->json([
                'stats' => [
                    ['label' => 'Usuarios Activos', 'value' => (string)User::count(), 'icon' => 'person', 'color' => 'text-primary'],
                    ['label' => 'Cursos Creados', 'value' => (string)Curso::count(), 'icon' => 'auto_stories', 'color' => 'text-secondary-fixed'],
                    ['label' => 'Estado del Sistema', 'value' => 'Estable', 'icon' => 'dns', 'color' => 'text-primary'],
                ]
            ]);
        }

        if ($user->role === 'docentes') {
            $misCursosIds = Curso::where('docente_id', $user->id)->pluck('id');
            $totalEstudiantes = \DB::table('curso_user')->whereIn('curso_id', $misCursosIds)->distinct('user_id')->count();
            $tareasPendientes = Entrega::whereIn('tarea_id', Tarea::whereIn('curso_id', $misCursosIds)->pluck('id'))
                                       ->whereNull('calificacion')->count();

            return response()->json([
                'stats' => [
                    ['label' => 'Total Estudiantes', 'value' => (string)$totalEstudiantes, 'icon' => 'group', 'color' => 'text-primary'],
                    ['label' => 'Mis Cursos', 'value' => (string)$misCursosIds->count(), 'icon' => 'cast_for_education', 'color' => 'text-secondary-fixed'],
                    ['label' => 'Tareas por Corregir', 'value' => (string)$tareasPendientes, 'icon' => 'pending_actions', 'color' => 'text-primary'],
                ]
            ]);
        }

        if ($user->role === 'estudiantes') {
            $misCursosIds = $user->cursos()->pluck('cursos.id');
            $tareasCompletadas = Entrega::where('user_id', $user->id)->count();
            $totalTareas = Tarea::whereIn('curso_id', $misCursosIds)->count();

            return response()->json([
                'stats' => [
                    ['label' => 'Promedio General', 'value' => (string)round(Entrega::where('user_id', $user->id)->avg('calificacion') ?? 0, 1), 'icon' => 'grade', 'color' => 'text-primary'],
                    ['label' => 'Tareas Completadas', 'value' => "$tareasCompletadas/$totalTareas", 'icon' => 'task_alt', 'color' => 'text-secondary-fixed'],
                    ['label' => 'Cursos Activos', 'value' => (string)$misCursosIds->count(), 'icon' => 'library_books', 'color' => 'text-primary'],
                ]
            ]);
        }

    public function serverInfo()
    {
        if (Auth::user()->role !== 'director') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server_os' => PHP_OS,
            'memory_usage' => $this->formatBytes(memory_get_usage(true)),
            'database_driver' => \DB::connection()->getDriverName(),
            'environment' => config('app.env'),
            'uptime' => 'Activo', // Render no da uptime simple, pero indica que está corriendo
            'limit_warning' => 'Cerca del límite (512MB RAM en Render Free)'
        ]);
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
