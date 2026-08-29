import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/curso.dart';
import '../models/tarea.dart';
import '../models/entrega.dart';
import '../providers/tarea_provider.dart';
import '../providers/user_provider.dart';

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
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final tareaProvider = Provider.of<TareaProvider>(context, listen: false);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Entregar: ${tarea.titulo}"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("En esta versión puedes enviar un comentario como entrega."),
            const SizedBox(height: 16),
            TextField(
              controller: commentController,
              decoration: const InputDecoration(
                labelText: "Tu respuesta o comentario",
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
            onPressed: () async {
              if (userProvider.user == null) return;
              
              final entrega = Entrega(
                tareaId: tarea.id,
                userId: userProvider.user!.id,
                comentarioEstudiante: commentController.text,
              );

              final success = await tareaProvider.entregarTarea(entrega);
              
              if (context.mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(success ? "Tarea entregada con éxito" : "Error al enviar la tarea"),
                    backgroundColor: success ? Colors.green : Colors.red,
                  ),
                );
              }
            },
            child: const Text("Enviar Entrega"),
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
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
      ),
      body: tareaProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => tareaProvider.fetchTareas(widget.curso.id),
              child: tareaProvider.tareas.isEmpty
                  ? ListView(
                      children: const [
                        Padding(
                          padding: EdgeInsets.only(top: 100),
                          child: Center(child: Text("No hay tareas pendientes.")),
                        ),
                      ],
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: tareaProvider.tareas.length,
                      itemBuilder: (context, index) {
                        final tarea = tareaProvider.tareas[index];
                        return Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 3,
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        tarea.titulo,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.amber[100],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        "${tarea.puntos} pts",
                                        style: TextStyle(color: Colors.amber[900], fontWeight: FontWeight.bold, fontSize: 12),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  tarea.contenido ?? "Sin descripción adicional.",
                                  style: TextStyle(color: Colors.grey[700]),
                                ),
                                const Divider(height: 24),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                                        const SizedBox(width: 4),
                                        Text(
                                          tarea.fechaEntrega ?? "Sin fecha",
                                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                                        ),
                                      ],
                                    ),
                                    ElevatedButton.icon(
                                      icon: const Icon(Icons.send, size: 16),
                                      label: const Text("Entregar"),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF4F46E5),
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                      onPressed: () => _showEntregaDialog(tarea),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}

