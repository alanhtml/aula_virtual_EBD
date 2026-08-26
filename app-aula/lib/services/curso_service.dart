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
      // Por ahora usamos el historial y filtramos los que están "cursando"
      // o adaptamos el backend si es necesario.
      final historial = await getHistorialAcademico();
      return historial.where((c) => c.pivot?.estado == 'cursando').toList();
    } catch (e) {
      return [];
    }
  }
}
