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

  void _showCreateTareaDialog(BuildContext context) {
    final tituloController = TextEditingController();
    final descController = TextEditingController();
    final puntosController = TextEditingController(text: "100");

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Nueva Tarea"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: tituloController, decoration: const InputDecoration(labelText: "Título")),
            TextField(controller: descController, decoration: const InputDecoration(labelText: "Descripción")),
            TextField(
              controller: puntosController,
              decoration: const InputDecoration(labelText: "Puntos"),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
          ElevatedButton(
            onPressed: () async {
              final success = await Provider.of<TareaProvider>(context, listen: false).createTarea(
                widget.curso.id,
                tituloController.text,
                descController.text,
                int.tryParse(puntosController.text) ?? 100,
                DateTime.now().add(const Duration(days: 7)).toIso8601String(),
              );
              if (success) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Tarea creada"), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text("Crear"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tareaProvider = Provider.of<TareaProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text("Tareas: ${widget.curso.nombre}"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateTareaDialog(context),
        backgroundColor: const Color(0xFF059669),
        child: const Icon(Icons.add, color: Colors.white),
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
                        margin: const EdgeInsets.only(bottom: 12),
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
