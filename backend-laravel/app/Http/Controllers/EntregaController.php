<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EntregaController extends Controller
{
    public function index(Request $request)
    {
        $tareaId = $request->query('tarea_id');
        $query = Entrega::with('user');

        if ($tareaId) {
            $query->where('tarea_id', $tareaId);
        }

        // Si es estudiante, solo ve sus propias entregas
        if (Auth::user()->rol === 'estudiante') {
            $query->where('user_id', Auth::id());
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tarea_id' => 'required|exists:tareas,id',
            'comentario_estudiante' => 'nullable|string',
            'archivo' => 'required|file|max:10240', // Max 10MB
        ]);

        $user = Auth::user();
        $tareaId = $request->input('tarea_id');

        // Buscar entrega existente para borrar el archivo anterior si existe
        $entregaExistente = Entrega::where('tarea_id', $tareaId)
            ->where('user_id', $user->id)
            ->first();

        if ($entregaExistente && $entregaExistente->archivo_url) {
            // Lógica para borrar archivo anterior si es necesario
            // Por simplicidad en este paso, solo guardamos el nuevo
        }

        $path = '';
        $file = $request->file('archivo');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . uniqid() . '.' . $extension;

        // Si es imagen, comprimir con GD
        if (str_starts_with($file->getMimeType(), 'image/') && in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
            $image = null;
            if (strtolower($extension) === 'png') {
                $image = @imagecreatefrompng($file->getRealPath());
            } else {
                $image = @imagecreatefromjpeg($file->getRealPath());
            }

            if ($image) {
                $width = imagesx($image);
                $height = imagesy($image);
                $maxSize = 1000; // Un poco más pequeño para entregas de alumnos

                if ($width > $maxSize) {
                    $newWidth = $maxSize;
                    $newHeight = ($height / $width) * $maxSize;
                    $tmp = imagecreatetruecolor($newWidth, $newHeight);
                    imagecopyresampled($tmp, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    $image = $tmp;
                }

                ob_start();
                imagejpeg($image, null, 65); // 65% calidad para alumnos (ahorro máximo)
                $content = ob_get_clean();
                $filename = pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
                \Illuminate\Support\Facades\Storage::disk('public')->put('entregas/' . $filename, $content);
                $path = 'entregas/' . $filename;
                imagedestroy($image);
            } else {
                $path = $file->storeAs('entregas', $filename, 'public');
            }
        } else {
            $path = $file->storeAs('entregas', $filename, 'public');
        }

        $archivoUrl = asset('storage/' . $path);

        $entrega = Entrega::updateOrCreate(
            ['tarea_id' => $tareaId, 'user_id' => $user->id],
            [
                'comentario_estudiante' => $request->input('comentario_estudiante'),
                'archivo_url' => $archivoUrl,
                'fecha_entrega' => now(),
            ]
        );

        return response()->json($entrega, 201);
    }

    public function show(Entrega $entrega)
    {
        return $entrega->load(['tarea', 'user']);
    }

    public function calificar(Request $request, Entrega $entrega)
    {
        $validated = $request->validate([
            'calificacion' => 'required|numeric|min:0|max:100',
            'comentario_profesor' => 'nullable|string',
        ]);

        $entrega->update($validated);
        return $entrega;
    }

    public function misCalificaciones()
    {
        $user = Auth::user();
        $entregas = Entrega::with(['tarea.curso'])
            ->where('user_id', $user->id)
            ->whereNotNull('calificacion')
            ->get();

        return response()->json($entregas);
    }
}
