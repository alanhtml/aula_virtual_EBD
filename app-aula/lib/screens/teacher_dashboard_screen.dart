import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../providers/curso_provider.dart';
import 'asistencia_screen.dart';

class TeacherDashboard extends StatefulWidget {
  const TeacherDashboard({super.key});

  @override
  State<TeacherDashboard> createState() => _TeacherDashboardState();
}

class _TeacherDashboardState extends State<TeacherDashboard> {
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
        title: const Text("Panel Docente", style: TextStyle(fontWeight: FontWeight.bold)),
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
                  colors: [Color(0xFF059669), Color(0xFF10B981)],
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
                      user?.name[0] ?? "D",
                      style: const TextStyle(fontSize: 24, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Bienvenido, Docente", style: TextStyle(color: Colors.white70)),
                        Text(
                          user?.name ?? "Docente",
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            const Text("Mis Cursos Asignados", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            if (cursoProvider.isLoading)
              const Center(child: CircularProgressIndicator())
            else if (cursoProvider.cursos.isEmpty)
              const Center(child: Text("No tienes cursos asignados este semestre."))
            else
              ...cursoProvider.cursos.map((curso) => _buildTeacherCursoCard(curso)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildTeacherCursoCard(dynamic curso) {
    return Card(
      margin: const EdgeInsets.bottom(15),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.class_rounded, color: Color(0xFF059669)),
                const SizedBox(width: 10),
                Text(curso.nombre, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 5),
            Text("Código: ${curso.codigo}", style: TextStyle(color: Colors.grey[600])),
            const Divider(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF059669),
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AsistenciaScreen(curso: curso),
                        ),
                      );
                    },
                    icon: const Icon(Icons.how_to_reg),
                    label: const Text("Tomar Asistencia"),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
