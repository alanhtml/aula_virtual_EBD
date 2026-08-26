import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/tarea_provider.dart';

class CalificacionesScreen extends StatelessWidget {
  const CalificacionesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tareaProvider = Provider.of<TareaProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text("Mis Calificaciones")),
      body: RefreshIndicator(
        onRefresh: () => tareaProvider.fetchCalificaciones(),
        child: tareaProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : tareaProvider.calificaciones.isEmpty
                ? const Center(child: Text("Aún no tienes tareas calificadas."))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: tareaProvider.calificaciones.length,
                    itemBuilder: (context, index) {
                      final entrega = tareaProvider.calificaciones[index];
                      return Card(
                        margin: const EdgeInsets.bottom(12),
                        child: ListTile(
                          leading: const Icon(Icons.assignment_turned_in, color: Color(0xFF4F46E5)),
                          title: Text("Tarea #${entrega.tareaId}"),
                          subtitle: Text(entrega.comentarioProfesor ?? "Sin comentarios del docente"),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF4F46E5).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              "${entrega.calificacion?.toStringAsFixed(0) ?? '0'}/100",
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
