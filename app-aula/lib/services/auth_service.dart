import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'dio_client.dart';

class AuthService {
  final Dio _dio = DioClient().dio;

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post('/login', data: {
        'username': username.trim(),
        'password': password.trim(),
      });

      if (response.statusCode == 200) {
        final token = response.data['token'] ?? response.data['access_token'];
        final userData = User.fromJson(response.data['user']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        
        return {'success': true, 'user': userData};
      }
      return {'success': false, 'message': 'Credenciales inválidas'};
    } on DioException catch (e) {
      print("Login DioException: ${e.response?.statusCode} - ${e.response?.data}");
      if (e.response != null && e.response?.data != null) {
        final data = e.response!.data;
        if (data is Map && data.containsKey('message')) {
          return {'success': false, 'message': data['message']};
        }
        if (data is Map && data.containsKey('errors')) {
          final errors = data['errors'] as Map;
          final firstError = errors.values.first;
          if (firstError is List && firstError.isNotEmpty) {
            return {'success': false, 'message': firstError.first};
          }
        }
      }
      if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
        return {'success': false, 'message': 'El servidor está iniciando. Espera unos segundos y reintenta.'};
      }
      return {'success': false, 'message': 'Error al autenticar: ${e.message ?? 'Verifique su conexión'}'};
    } catch (e) {
      print("Login unexpected error: $e");
      return {'success': false, 'message': 'Error inesperado: $e'};
    }
  }

  Future<User?> getMe() async {
    try {
      final response = await _dio.get('/user');
      if (response.statusCode == 200) {
        return User.fromJson(response.data);
      }
    } catch (e) {
      print("Error fetching user: $e");
    }
    return null;
  }

  Future<void> logout() async {
    try {
      await _dio.post('/logout');
    } finally {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');
    }
  }
}
