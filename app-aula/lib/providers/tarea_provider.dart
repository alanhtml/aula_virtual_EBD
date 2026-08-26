import 'package:flutter/material.dart';
import '../models/tarea.dart';
import '../models/entrega.dart';
import '../services/tarea_service.dart';

class TareaProvider with ChangeNotifier {
  List<Tarea> _tareas = [];
  List<Entrega> _calificaciones = [];
  bool _isLoading = false;
  final TareaService _tareaService = TareaService();

  List<Tarea> get tareas => _tareas;
  List<Entrega> get calificaciones => _calificaciones;
  bool get isLoading => _isLoading;

  Future<void> fetchTareas(int cursoId) async {
    _isLoading = true;
    notifyListeners();

    _tareas = await _tareaService.getTareasPorCurso(cursoId);
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchCalificaciones() async {
    _isLoading = true;
    notifyListeners();

    _calificaciones = await _tareaService.getMisCalificaciones();
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> entregarTarea(Entrega entrega) async {
    final success = await _tareaService.enviarTarea(entrega);
    if (success) {
      notifyListeners();
    }
    return success;
  }
}
