import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../providers/curso_provider.dart';
import 'historial_screen.dart';
import 'calificaciones_screen.dart';
import 'student_tareas_screen.dart';
import 'materiales_screen.dart';
import 'foro_screen.dart';

class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});

  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<CursoProvider>(context, listen: false).fetchCursos();
    });
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final cursoProvider = Provider.of<CursoProvider>(context);
    final user = userProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mi Aula Virtual", style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () => userProvider.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white.withOpacity(0.2),
                    child: Text(
                      user?.name[0] ?? "U",
                      style: const TextStyle(fontSize: 24, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("¡Bienvenido!", style: TextStyle(color: Colors.white70)),
                        Text(
                          user?.name ?? "Estudiante",
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            const Text("Explorar", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            Row(
              children: [
                _buildQuickAction(
                  context, 
                  "Historial", 
                  Icons.history_edu, 
                  const HistorialScreen()
                ),
                const SizedBox(width: 15),
                _buildQuickAction(
                  context, 
                  "Notas", 
                  Icons.grade_outlined, 
                  const CalificacionesScreen()
                ),
                _buildQuickAction(
                  context, 
                  "Materiales", 
                  Icons.library_books, 
                  MaterialesScreen(curso: curso),
                ),
                const SizedBox(width: 15),
                _buildQuickAction(
                  context, 
                  "Foros", 
                  Icons.forum_outlined, 
                  ForoScreen(curso: curso),
                ),
              ],
            ),
            const SizedBox(height: 30),
            const Text("Módulo en curso", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            if (cursoProvider.isLoading)
              const Center(child: CircularProgressIndicator())
            else if (cursoProvider.cursos.isEmpty)
              _buildEmptyState("No tienes módulos activos actualmente.")
            else
              ...cursoProvider.cursos.map((curso) => _buildCursoCard(curso)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, String label, IconData icon, Widget target, {bool enabled = true}) {
    return Expanded(
      child: InkWell(
        onTap: enabled ? () => Navigator.push(context, MaterialPageRoute(builder: (_) => target)) : null,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            color: enabled ? Colors.white : Colors.grey[200],
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              if (enabled) BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 5))
            ],
          ),
          child: Column(
            children: [
              Icon(icon, color: enabled ? const Color(0xFF4F46E5) : Colors.grey, size: 30),
              const SizedBox(height: 8),
              Text(label, style: TextStyle(fontWeight: FontWeight.w600, color: enabled ? Colors.black : Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCursoCard(dynamic curso) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: const Color(0xFF4F46E5).withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.book_rounded, color: Color(0xFF4F46E5)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(curso.nombre, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text("Nivel ${curso.nivel}", style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                    ],
                  ),
                ),
                _buildQuickAction(
                  context, 
                  "Materiales", 
                  Icons.library_books, 
                  MaterialesScreen(curso: curso),
                ),
                const SizedBox(width: 15),
                _buildQuickAction(
                  context, 
                  "Foros", 
                  Icons.forum_outlined, 
                  ForoScreen(curso: curso),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Progreso", style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(curso.pivot?.estado?.toUpperCase() ?? "CURSANDO", 
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => StudentTareasScreen(curso: curso),
                      ),
                    );
                  },
                  child: const Text("Ir al módulo"),
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(String msg) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(15)),
      child: Column(
        children: [
          Icon(Icons.info_outline, color: Colors.grey[400], size: 40),
          const SizedBox(height: 10),
          Text(msg, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey[600])),
        ],
      ),
    );
  }
}
