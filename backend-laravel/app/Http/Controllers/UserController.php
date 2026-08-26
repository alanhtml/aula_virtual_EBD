<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'docentes') {
            // Obtener IDs de los cursos del docente
            $misCursosIds = \App\Models\Curso::where('docente_id', $user->id)
                ->orWhereHas('docentes', function($q) use ($user) {
                    $q->where('users.id', $user->id);
                })
                ->pluck('id');

            // Retornar solo estudiantes inscritos en esos cursos
            return response()->json(User::where('role', 'estudiantes')
                ->whereHas('cursos', function($q) use ($misCursosIds) {
                    $q->whereIn('cursos.id', $misCursosIds);
                })->get());
        }

        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'role' => 'required|in:estudiantes,docentes,secretaria,director',
            'password' => 'required|string|min:8',
            'fecha_nacimiento' => 'nullable|date',
            'ci' => 'nullable|string',
            'telefono' => 'nullable|string',
            'curso_id' => 'nullable|exists:cursos,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'ci' => $validated['ci'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
        ]);

        if ($validated['role'] === 'estudiantes' && !empty($validated['curso_id'])) {
            $user->cursos()->attach($validated['curso_id']);
        }

        return response()->json($user->load('cursos'), 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id,
            'role' => 'sometimes|required|in:estudiantes,docentes,secretaria,director',
            'password' => 'sometimes|nullable|string|min:8',
            'fecha_nacimiento' => 'sometimes|nullable|date',
            'ci' => 'sometimes|nullable|string',
            'telefono' => 'sometimes|nullable|string',
            'curso_id' => 'sometimes|nullable|exists:cursos,id'
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if ($user->role === 'estudiantes' && isset($validated['curso_id'])) {
            $user->cursos()->sync([$validated['curso_id']]);
        }

        return response()->json($user->load('cursos'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
