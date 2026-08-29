<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Curso;
use App\Models\Tarea;
use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['stats' => []]);

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
            $totalEstudiantes = DB::table('curso_user')->whereIn('curso_id', $misCursosIds)->distinct()->count('user_id');
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

        return response()->json(['stats' => []]);
    }

    public function serverInfo()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'director') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            // Obtener info de disco
            $path = base_path();
            $totalSpace = disk_total_space($path);
            $freeSpace = disk_free_space($path);
            $usedSpace = $totalSpace - $freeSpace;
            $diskPercentage = ($totalSpace > 0) ? round(($usedSpace / $totalSpace) * 100, 1) : 0;

            return response()->json([
                'debug_version' => '1.1', // Campo para verificar actualización
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'server_os' => PHP_OS,
                'memory_usage' => $this->formatBytes(memory_get_usage(true)),
                'database_driver' => DB::connection()->getDriverName(),
                'environment' => config('app.env'),
                'uptime' => 'Activo',
                'limit_warning' => 'Límite: 512MB RAM',
                'disk_usage' => $this->formatBytes($usedSpace),
                'disk_total' => $this->formatBytes($totalSpace),
                'disk_percentage' => $diskPercentage
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener info del servidor'], 500);
        }
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
