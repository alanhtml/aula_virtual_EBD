import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/curso.dart';
import '../models/user.dart';
import '../providers/asistencia_provider.dart';
import '../services/dio_client.dart';
import 'package:intl/intl.dart';

class AsistenciaScreen extends StatefulWidget {
  final Curso curso;
  const AsistenciaScreen({super.key, required this.curso});

  @override
  State<AsistenciaScreen> createState() => _AsistenciaScreenState();
}

class _AsistenciaScreenState extends State<AsistenciaScreen> {
  DateTime _selectedDate = DateTime.now();
  List<User> _estudiantes = [];
  Map<int, String> _estados = {}; // userId -> estado
  bool _isFetchingStudents = false;

  @override
  void initState() {
    super.initState();
    _fetchStudents();
  }

  Future<void> _fetchStudents() async {
    setState(() => _isFetchingStudents = true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/cursos/${widget.curso.id}');
      if (response.statusCode == 200) {
        final List<dynamic> studentsData = response.data['estudiantes'];
        setState(() {
          _estudiantes = studentsData.map((s) => User.fromJson(s)).toList();
          for (var s in _estudiantes) {
            _estados[s.id] = 'presente'; // Por defecto presentes
          }
        });
        
        // Cargar asistencias ya guardadas si existen para esta fecha
        await _loadExistingAsistencia();
      }
    } catch (e) {
      print("Error fetching students: $e");
    } finally {
      setState(() => _isFetchingStudents = false);
    }
  }

  Future<void> _loadExistingAsistencia() async {
    final asistenciaProvider = Provider.of<AsistenciaProvider>(context, listen: false);
    final fechaStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
    await asistenciaProvider.fetchAsistencias(widget.curso.id, fechaStr);
    
    if (asistenciaProvider.asistencias.isNotEmpty) {
      setState(() {
        for (var a in asistenciaProvider.asistencias) {
          _estados[a.userId] = a.estado;
        }
      });
    }
  }

  void _submitAsistencia() async {
    final asistenciaProvider = Provider.of<AsistenciaProvider>(context, listen: false);
    final fechaStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
    final messenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);
    
    List<Map<String, dynamic>> data = _estados.entries.map((e) => {
      'user_id': e.key,
      'estado': e.value,
      'observaciones': '',
    }).toList();

    final success = await asistenciaProvider.registrarAsistencia(
      cursoId: widget.curso.id,
      fecha: fechaStr,
      asistencias: data,
    );

    if (success) {
      messenger.showSnackBar(
        const SnackBar(content: Text("Asistencia guardada correctamente"), backgroundColor: Colors.green),
      );
      navigator.pop();
    } else {
      messenger.showSnackBar(
        const SnackBar(content: Text("Error al guardar asistencia"), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Asistencia: ${widget.curso.nombre}"),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_month),
            onPressed: () async {
              final DateTime? picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime(2024),
                lastDate: DateTime(2030),
              );
              if (picked != null && picked != _selectedDate) {
                setState(() => _selectedDate = picked);
                _loadExistingAsistencia();
              }
            },
          )
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Fecha: ${DateFormat('dd/MM/yyyy').format(_selectedDate)}",
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text("${_estudiantes.length} estudiantes", style: TextStyle(color: Colors.grey[600])),
              ],
            ),
          ),
          Expanded(
            child: _isFetchingStudents
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: _estudiantes.length,
                    itemBuilder: (context, index) {
                      final student = _estudiantes[index];
                      final currentEstado = _estados[student.id];

                      return ListTile(
                        title: Text(student.name),
                        subtitle: Text(student.username),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _buildEstadoIcon(student.id, 'presente', Icons.check_circle, Colors.green, currentEstado),
                            _buildEstadoIcon(student.id, 'ausente', Icons.cancel, Colors.red, currentEstado),
                            _buildEstadoIcon(student.id, 'justificado', Icons.info, Colors.orange, currentEstado),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669)),
                onPressed: Provider.of<AsistenciaProvider>(context).isLoading ? null : _submitAsistencia,
                child: const Text("Guardar Asistencia", style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildEstadoIcon(int userId, String estado, IconData icon, Color color, String? currentEstado) {
    bool isSelected = currentEstado == estado;
    return IconButton(
      icon: Icon(icon, color: isSelected ? color : Colors.grey[300]),
      onPressed: () {
        setState(() {
          _estados[userId] = estado;
        });
      },
    );
  }
}
