import 'package:dio/dio.dart';
import '../models/tarea.dart';
import '../models/entrega.dart';
import 'dio_client.dart';

class TareaService {
  final Dio _dio = DioClient().dio;

  Future<List<Tarea>> getTareasPorCurso(int cursoId) async {
    try {
      final response = await _dio.get('/tareas', queryParameters: {'curso_id': cursoId});
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => Tarea.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching tareas: $e");
      return [];
    }
  }

  Future<bool> enviarTarea(Entrega entrega) async {
    try {
      final response = await _dio.post('/entregas', data: entrega.toJson());
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print("Error enviando tarea: $e");
      return false;
    }
  }

  Future<bool> createTarea(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/tareas', data: data);
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print("Error creating tarea: $e");
      return false;
    }
  }

  Future<List<Entrega>> getEntregasPorTarea(int tareaId) async {
    try {
      final response = await _dio.get('/entregas', queryParameters: {'tarea_id': tareaId});
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => Entrega.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching entregas: $e");
      return [];
    }
  }

  Future<bool> calificarEntrega(int entregaId, double calificacion, String comentario) async {
    try {
      final response = await _dio.post('/entregas/$entregaId/calificar', data: {
        'calificacion': calificacion,
        'comentario_profesor': comentario,
      });
      return response.statusCode == 200;
    } catch (e) {
      print("Error calificando entrega: $e");
      return false;
    }
  }

  Future<List<Entrega>> getMisCalificaciones() async {
    try {
      final response = await _dio.get('/mis-calificaciones');
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => Entrega.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching calificaciones: $e");
      return [];
    }
  }
}
