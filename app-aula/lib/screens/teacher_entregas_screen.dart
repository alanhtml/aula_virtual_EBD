import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tarea.dart';
import '../providers/tarea_provider.dart';

class TeacherEntregasScreen extends StatefulWidget {
  final Tarea tarea;
  const TeacherEntregasScreen({super.key, required this.tarea});

  @override
  State<TeacherEntregasScreen> createState() => _TeacherEntregasScreenState();
}

class _TeacherEntregasScreenState extends State<TeacherEntregasScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<TareaProvider>(context, listen: false).fetchEntregasPorTarea(widget.tarea.id);
    });
  }

  void _showGradeDialog(BuildContext context, dynamic entrega) {
    final gradeController = TextEditingController(text: entrega.calificacion?.toString() ?? "");
    final feedbackController = TextEditingController(text: entrega.comentarioProfesor ?? "");

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Calificar Entrega"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: gradeController,
              decoration: const InputDecoration(labelText: "Nota (0-100)"),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: feedbackController,
              decoration: const InputDecoration(labelText: "Retroalimentación"),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
          ElevatedButton(
            onPressed: () async {
              final grade = double.tryParse(gradeController.text) ?? 0.0;
              final success = await Provider.of<TareaProvider>(context, listen: false)
                  .calificarEntrega(entrega.id, grade, feedbackController.text);
              
              if (success) {
                Navigator.pop(context);
                Provider.of<TareaProvider>(context, listen: false).fetchEntregasPorTarea(widget.tarea.id);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Calificación guardada"), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text("Guardar"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tareaProvider = Provider.of<TareaProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text("Entregas: ${widget.tarea.titulo}")),
      body: tareaProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : tareaProvider.entregasTarea.isEmpty
              ? const Center(child: Text("Nadie ha entregado esta tarea aún."))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tareaProvider.entregasTarea.length,
                  itemBuilder: (context, index) {
                    final entrega = tareaProvider.entregasTarea[index];
                    final bool calificada = entrega.calificacion != null;

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: calificada ? Colors.green[100] : Colors.orange[100],
                          child: Icon(
                            calificada ? Icons.check : Icons.pending_actions,
                            color: calificada ? Colors.green : Colors.orange,
                          ),
                        ),
                        title: Text(entrega.user?.name ?? "Estudiante #${entrega.userId}"),
                        subtitle: Text(entrega.comentarioEstudiante ?? "Sin comentarios"),
                        trailing: Text(
                          "${entrega.calificacion?.toStringAsFixed(0) ?? '--'}/${widget.tarea.puntos}",
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        onTap: () => _showGradeDialog(context, entrega),
                      ),
                    );
                  },
                ),
    );
  }
}
