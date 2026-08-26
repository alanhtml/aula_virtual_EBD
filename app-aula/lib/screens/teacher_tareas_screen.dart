import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/curso.dart';
import '../providers/tarea_provider.dart';
import 'teacher_entregas_screen.dart';

class TeacherTareasScreen extends StatefulWidget {
  final Curso curso;
  const TeacherTareasScreen({super.key, required this.curso});

  @override
  State<TeacherTareasScreen> createState() => _TeacherTareasScreenState();
}

class _TeacherTareasScreenState extends State<TeacherTareasScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<TareaProvider>(context, listen: false).fetchTareas(widget.curso.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final tareaProvider = Provider.of<TareaProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text("Tareas: ${widget.curso.nombre}"),
      ),
      body: tareaProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : tareaProvider.tareas.isEmpty
              ? const Center(child: Text("No hay tareas creadas en este módulo."))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tareaProvider.tareas.length,
                  itemBuilder: (context, index) {
                    final tarea = tareaProvider.tareas[index];
                    return Card(
                      margin: const EdgeInsets.bottom(12),
                      child: ListTile(
                        leading: const Icon(Icons.assignment, color: Color(0xFF059669)),
                        title: Text(tarea.titulo, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text("Puntos: ${tarea.puntos} • Entrega: ${tarea.fechaEntrega ?? 'Sin fecha'}"),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => TeacherEntregasScreen(tarea: tarea),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
