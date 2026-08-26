import 'package:flutter/foundation.dart';
import '../models/asistencia.dart';
import 'dio_client.dart';

class AsistenciaService {
  final _dio = DioClient().dio;

  Future<bool> registrarAsistencia({
    required int cursoId,
    required String fecha,
    required List<Map<String, dynamic>> asistencias,
  }) async {
    try {
      final response = await _dio.post('/asistencias', data: {
        'curso_id': cursoId,
        'fecha': fecha,
        'asistencias': asistencias,
      });
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) {
        print("Error registrando asistencia: $e");
      }
      return false;
    }
  }

  Future<List<Asistencia>> getAsistenciasPorCurso(int cursoId, String fecha) async {
    try {
      final response = await _dio.get('/asistencias/curso/$cursoId', queryParameters: {'fecha': fecha});
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => Asistencia.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      if (kDebugMode) {
        print("Error fetching asistencias: $e");
      }
      return [];
    }
  }
}
