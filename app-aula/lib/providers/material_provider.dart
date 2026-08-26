import 'dart:io';
import 'package:flutter/material.dart';
import '../models/material.dart';
import '../services/material_service.dart';

class MaterialProvider with ChangeNotifier {
  final MaterialService _service = MaterialService();
  List<MaterialAcademico> _materiales = [];
  bool _isLoading = false;

  List<MaterialAcademico> get materiales => _materiales;
  bool get isLoading => _isLoading;

  Future<void> fetchMateriales(int cursoId) async {
    _isLoading = true;
    notifyListeners();
    _materiales = await _service.getMateriales(cursoId);
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> crearMaterial({
    required String titulo,
    String? descripcion,
    required String tipo,
    required int cursoId,
    File? archivo,
    String? url,
  }) async {
    _isLoading = true;
    notifyListeners();
    final success = await _service.uploadMaterial(
      titulo: titulo,
      descripcion: descripcion,
      tipo: tipo,
      cursoId: cursoId,
      archivo: archivo,
      url: url,
    );
    if (success) await fetchMateriales(cursoId);
    _isLoading = false;
    notifyListeners();
    return success;
  }

  Future<bool> eliminarMaterial(int id, int cursoId) async {
    final success = await _service.deleteMaterial(id);
    if (success) await fetchMateriales(cursoId);
    return success;
  }
}
