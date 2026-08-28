import 'package:flutter/material.dart';
import '../models/curso.dart';
import '../services/curso_service.dart';

class CursoProvider with ChangeNotifier {
  List<Curso> _cursos = [];
  List<Curso> _historial = [];
  Map<String, dynamic>? _disponibleInscripcion;
  bool _isLoading = false;
  final CursoService _cursoService = CursoService();

  List<Curso> get cursos => _cursos;
  List<Curso> get historial => _historial;
  Map<String, dynamic>? get disponibleInscripcion => _disponibleInscripcion;
  bool get isLoading => _isLoading;

  Future<void> fetchCursos() async {
    _isLoading = true;
    notifyListeners();

    _cursos = await _cursoService.getMisCursos();
    if (_cursos.isEmpty) {
      _disponibleInscripcion = await _cursoService.getDisponibleInscripcion();
    } else {
      _disponibleInscripcion = null;
    }
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchHistorial() async {
    _isLoading = true;
    notifyListeners();

    _historial = await _cursoService.getHistorialAcademico();
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> confirmarAutoInscripcion() async {
    _isLoading = true;
    notifyListeners();

    final success = await _cursoService.autoInscribirme();
    if (success) {
      await fetchCursos();
    } else {
      _isLoading = false;
      notifyListeners();
    }
    return success;
  }
}
