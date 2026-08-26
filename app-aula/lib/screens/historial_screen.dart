import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/curso_provider.dart';
import 'package:intl/intl.dart';

class HistorialScreen extends StatelessWidget {
  const HistorialScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cursoProvider = Provider.of<CursoProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text("Historial Académico")),
      body: RefreshIndicator(
        onRefresh: () => cursoProvider.fetchHistorial(),
        child: cursoProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : cursoProvider.historial.isEmpty
                ? const Center(child: Text("No tienes registros académicos aún."))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: cursoProvider.historial.length,
                    itemBuilder: (context, index) {
                      final curso = cursoProvider.historial[index];
                      final pivot = curso.pivot;
                      final bool aprobado = pivot?.estado == 'aprobado';

                      return Card(
                        margin: const EdgeInsets.bottom(12),
                        child: ListTile(
                          title: Text(curso.nombre, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text("Código: ${curso.codigo} • ${curso.semestre}"),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                pivot?.notaFinal?.toString() ?? "--",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: aprobado ? Colors.green : Colors.red,
                                ),
                              ),
                              Text(
                                pivot?.estado?.toUpperCase() ?? "CURSANDO",
                                style: TextStyle(fontSize: 10, color: Colors.grey[600]),
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
