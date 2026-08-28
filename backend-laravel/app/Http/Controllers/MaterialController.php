<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $cursoId = $request->query('curso_id');
        $masterId = $request->query('modulo_master_id');

        $query = Material::query();

        if ($cursoId) {
            $curso = \App\Models\Curso::find($cursoId);
            if ($curso && $curso->modulo_master_id) {
                $query->where(function($q) use ($cursoId, $curso) {
                    $q->where('curso_id', $cursoId)
                      ->orWhere('modulo_master_id', $curso->modulo_master_id);
                });
            } else {
                $query->where('curso_id', $cursoId);
            }
        } elseif ($masterId) {
            $query->where('modulo_master_id', $masterId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:pdf,video,enlace,imagen,otro',
            'curso_id' => 'nullable|exists:cursos,id',
            'modulo_master_id' => 'nullable|exists:modulo_masters,id',
            'seccion_id' => 'nullable|exists:seccions,id',
            'archivo' => 'required_if:tipo,pdf,otro,imagen|file|max:10240', // Max 10MB
            'url' => 'required_if:tipo,video,enlace|string',
        ]);

        if (!$request->curso_id && !$request->modulo_master_id) {
            return response()->json(['message' => 'Debe proporcionar un curso_id o un modulo_master_id'], 422);
        }

        $data = $request->only(['titulo', 'descripcion', 'tipo', 'curso_id', 'modulo_master_id', 'seccion_id']);

        if ($request->hasFile('archivo')) {
            $path = $request->file('archivo')->store('materiales', 'public');
            $data['url'] = Storage::url($path);
        } else {
            $data['url'] = $request->input('url');
        }

        $material = Material::create($data);
        return response()->json($material, 201);
    }

    public function show(Material $material)
    {
        return response()->json($material);
    }

    public function destroy(Material $material)
    {
        // Si es un archivo local, borrarlo
        if (str_contains($material->url, '/storage/materiales/')) {
            $path = str_replace('/storage/', '', $material->url);
            Storage::disk('public')->delete($path);
        }

        $material->delete();
        return response()->json(null, 204);
    }
}
