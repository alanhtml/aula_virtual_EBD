import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/curso.dart';
import '../models/tarea.dart';
import '../providers/tarea_provider.dart';

class StudentTareasScreen extends StatefulWidget {
  final Curso curso;
  const StudentTareasScreen({super.key, required this.curso});

  @override
  State<StudentTareasScreen> createState() => _StudentTareasScreenState();
}

class _StudentTareasScreenState extends State<StudentTareasScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<TareaProvider>(context, listen: false).fetchTareas(widget.curso.id);
    });
  }

  void _showEntregaDialog(Tarea tarea) {
    final commentController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Entregar: ${tarea.titulo}"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("En una versión real, aquí podrías subir un archivo."),
            const SizedBox(height: 16),
            TextField(
              controller: commentController,
              decoration: const InputDecoration(labelText: "Comentario"),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
          ElevatedButton(
            onPressed: () {
              // Lógica de entrega (simplificada)
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Tarea entregada (Simulado)"), backgroundColor: Colors.blue),
              );
            },
            child: const Text("Entregar"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tareaProvider = Provider.of<TareaProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text("Tareas: ${widget.curso.nombre}")),
      body: tareaProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : tareaProvider.tareas.isEmpty
              ? const Center(child: Text("No hay tareas pendientes."))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tareaProvider.tareas.length,
                  itemBuilder: (context, index) {
                    final tarea = tareaProvider.tareas[index];
                    return Card(
                      margin: const EdgeInsets.bottom(12),
                      child: ListTile(
                        title: Text(tarea.titulo, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(tarea.descripcion ?? "Sin descripción"),
                        trailing: ElevatedButton(
                          onPressed: () => _showEntregaDialog(tarea),
                          child: const Text("Entregar"),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
