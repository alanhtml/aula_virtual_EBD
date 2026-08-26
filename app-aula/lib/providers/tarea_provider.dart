import 'package:flutter/material.dart';
import '../models/tarea.dart';
import '../models/entrega.dart';
import '../services/tarea_service.dart';

class TareaProvider with ChangeNotifier {
  List<Tarea> _tareas = [];
  List<Entrega> _calificaciones = [];
  List<Entrega> _entregasTarea = []; // Para el docente: entregas de una tarea específica
  bool _isLoading = false;
  final TareaService _tareaService = TareaService();

  List<Tarea> get tareas => _tareas;
  List<Entrega> get calificaciones => _calificaciones;
  List<Entrega> get entregasTarea => _entregasTarea;
  bool get isLoading => _isLoading;

  Future<void> fetchTareas(int cursoId) async {
    _isLoading = true;
    notifyListeners();

    _tareas = await _tareaService.getTareasPorCurso(cursoId);
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> createTarea(int cursoId, String titulo, String descripcion, int puntos, String? fechaEntrega) async {
    _isLoading = true;
    notifyListeners();

    final success = await _tareaService.createTarea({
      'curso_id': cursoId,
      'titulo': titulo,
      'descripcion': descripcion,
      'puntos': puntos,
      'fecha_entrega': fechaEntrega,
    });
    
    if (success) await fetchTareas(cursoId);
    
    _isLoading = false;
    notifyListeners();
    return success;
  }

  Future<void> fetchEntregasPorTarea(int tareaId) async {
    _isLoading = true;
    notifyListeners();

    _entregasTarea = await _tareaService.getEntregasPorTarea(tareaId);
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> calificarEntrega(int entregaId, double calificacion, String comentario) async {
    _isLoading = true;
    notifyListeners();

    final success = await _tareaService.calificarEntrega(entregaId, calificacion, comentario);
    
    _isLoading = false;
    notifyListeners();
    return success;
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
