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
        if ($cursoId) {
            return response()->json(Material::where('curso_id', $cursoId)->get());
        }
        return response()->json(Material::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:pdf,video,enlace,imagen,otro',
            'curso_id' => 'required|exists:cursos,id',
            'seccion_id' => 'nullable|exists:seccions,id',
            'archivo' => 'required_if:tipo,pdf,otro,imagen|file|max:10240', // Max 10MB
            'url' => 'required_if:tipo,video,enlace|string',
        ]);

        $data = $request->only(['titulo', 'descripcion', 'tipo', 'curso_id', 'seccion_id']);

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
