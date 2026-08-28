import 'package:dio/dio.dart';
import '../models/curso.dart';
import 'dio_client.dart';

class CursoService {
  final Dio _dio = DioClient().dio;

  Future<List<Curso>> getHistorialAcademico() async {
    try {
      final response = await _dio.get('/historial-academico');
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => Curso.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching historial: $e");
      return [];
    }
  }

  Future<List<Curso>> getMisCursos() async {
    try {
      final historial = await getHistorialAcademico();
      return historial.where((c) => c.pivot?.estado == 'cursando').toList();
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>?> getDisponibleInscripcion() async {
    try {
      final response = await _dio.get('/cursos/disponible-inscripcion');
      if (response.statusCode == 200) {
        return Map<String, dynamic>.from(response.data);
      }
      return null;
    } catch (e) {
      print("Error fetching disponible inscripcion: $e");
      return null;
    }
  }

  Future<bool> autoInscribirme() async {
    try {
      final response = await _dio.post('/cursos/auto-inscribir');
      return response.statusCode == 200;
    } catch (e) {
      print("Error in autoInscribirme: $e");
      return false;
    }
  }
}
