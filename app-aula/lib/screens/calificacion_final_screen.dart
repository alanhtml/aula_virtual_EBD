import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/curso.dart';
import '../models/user.dart';
import '../services/dio_client.dart';
import 'package:dio/dio.dart';

class CalificacionFinalScreen extends StatefulWidget {
  final Curso curso;
  const CalificacionFinalScreen({super.key, required this.curso});

  @override
  State<CalificacionFinalScreen> createState() => _CalificacionFinalScreenState();
}

class _CalificacionFinalScreenState extends State<CalificacionFinalScreen> {
  List<User> _estudiantes = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchEstudiantes();
  }

  Future<void> _fetchEstudiantes() async {
    setState(() => _isLoading = true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/cursos/${widget.curso.id}');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['estudiantes'];
        setState(() {
          _estudiantes = data.map((s) => User.fromJson(s)).toList();
          // The User model here would need to include pivot data if we want to show current status
          // In the web version we used curso.estudiantes which includes pivot
        });
      }
    } catch (e) {
      print("Error: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showGradingModal(User estudiante) {
    // Note: In a real app, we'd fetch the pivot data for this specific student
    // For now, let's assume we are setting new values
    final notaController = TextEditingController();
    final retroController = TextEditingController();
    String estado = 'aprobado';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Calificar a ${estudiante.name}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: notaController,
              decoration: const InputDecoration(labelText: "Nota Final (0-100)"),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: retroController,
              decoration: const InputDecoration(labelText: "Retroalimentación"),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: estado,
              decoration: const InputDecoration(labelText: "Estado Final"),
              items: ['aprobado', 'reprobado', 'inactivo', 'retirado']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e.toUpperCase())))
                  .toList(),
              onChanged: (val) => estado = val!,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669)),
                onPressed: () async {
                  try {
                    final dio = DioClient().dio;
                    await dio.post('/cursos/${widget.curso.id}/calificar', data: {
                      'user_id': estudiante.id,
                      'nota_final': double.tryParse(notaController.text) ?? 0,
                      'retroalimentacion': retroController.text,
                      'estado': estado,
                    });
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Calificación registrada"), backgroundColor: Colors.green),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Error al calificar"), backgroundColor: Colors.red),
                    );
                  }
                },
                child: const Text("Confirmar Calificación", style: TextStyle(color: Colors.white)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Cerrar Módulo: ${widget.curso.nombre}")),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _estudiantes.length,
              itemBuilder: (context, index) {
                final student = _estudiantes[index];
                return Card(
                  margin: const EdgeInsets.bottom(12),
                  child: ListTile(
                    title: Text(student.name),
                    subtitle: Text(student.email),
                    trailing: const Icon(Icons.edit_note, color: Color(0xFF059669)),
                    onTap: () => _showGradingModal(student),
                  ),
                );
              },
            ),
    );
  }
}
