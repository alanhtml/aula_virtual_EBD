import 'package:flutter/material.dart';
import '../models/curso.dart';
import '../services/curso_service.dart';

class CursoProvider with ChangeNotifier {
  List<Curso> _cursos = [];
  List<Curso> _historial = [];
  bool _isLoading = false;
  final CursoService _cursoService = CursoService();

  List<Curso> get cursos => _cursos;
  List<Curso> get historial => _historial;
  bool get isLoading => _isLoading;

  Future<void> fetchCursos() async {
    _isLoading = true;
    notifyListeners();

    _cursos = await _cursoService.getMisCursos();
    
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
}
