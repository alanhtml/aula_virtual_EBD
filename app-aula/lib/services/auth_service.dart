import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'dio_client.dart';

class AuthService {
  final Dio _dio = DioClient().dio;

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post('/login', data: {
        'username': username,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['token'];
        final userData = User.fromJson(response.data['user']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        
        return {'success': true, 'user': userData};
      }
      return {'success': false, 'message': 'Credenciales inválidas'};
    } catch (e) {
      return {'success': false, 'message': 'Error de conexión'};
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
