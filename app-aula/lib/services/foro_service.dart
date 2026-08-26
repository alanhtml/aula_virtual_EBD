import '../models/foro_mensaje.dart';
import 'dio_client.dart';

class ForoService {
  final _dio = DioClient().dio;

  Future<List<ForoMensaje>> getMensajes(int cursoId) async {
    try {
      final response = await _dio.get('/foros', queryParameters: {'curso_id': cursoId});
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => ForoMensaje.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<ForoMensaje?> enviarMensaje(int cursoId, String contenido) async {
    try {
      final response = await _dio.post('/foros', data: {
        'curso_id': cursoId,
        'contenido': contenido,
      });
      if (response.statusCode == 201) {
        return ForoMensaje.fromJson(response.data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
