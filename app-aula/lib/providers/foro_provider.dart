import 'package:flutter/material.dart';
import '../models/foro_mensaje.dart';
import '../services/foro_service.dart';

class ForoProvider with ChangeNotifier {
  final ForoService _service = ForoService();
  List<ForoMensaje> _mensajes = [];
  bool _isLoading = false;

  List<ForoMensaje> get mensajes => _mensajes;
  bool get isLoading => _isLoading;

  Future<void> fetchMensajes(int cursoId) async {
    _isLoading = true;
    notifyListeners();
    _mensajes = await _service.getMensajes(cursoId);
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> enviarMensaje(int cursoId, String contenido) async {
    final nuevo = await _service.enviarMensaje(cursoId, contenido);
    if (nuevo != null) {
      _mensajes.add(nuevo);
      notifyListeners();
      return true;
    }
    return false;
  }
}
