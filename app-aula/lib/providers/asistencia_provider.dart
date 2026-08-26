import 'package:flutter/material.dart';
import '../models/asistencia.dart';
import '../services/asistencia_service.dart';

class AsistenciaProvider with ChangeNotifier {
  final AsistenciaService _asistenciaService = AsistenciaService();
  List<Asistencia> _asistencias = [];
  bool _isLoading = false;

  List<Asistencia> get asistencias => _asistencias;
  bool get isLoading => _isLoading;

  Future<void> fetchAsistencias(int cursoId, String fecha) async {
    _isLoading = true;
    notifyListeners();
    _asistencias = await _asistenciaService.getAsistenciasPorCurso(cursoId, fecha);
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> registrarAsistencia({
    required int cursoId,
    required String fecha,
    required List<Map<String, dynamic>> asistencias,
  }) async {
    _isLoading = true;
    notifyListeners();
    final success = await _asistenciaService.registrarAsistencia(
      cursoId: cursoId,
      fecha: fecha,
      asistencias: asistencias,
    );
    _isLoading = false;
    notifyListeners();
    return success;
  }
}
