import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class UserProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  final AuthService _authService = AuthService();

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  Future<Map<String, dynamic>> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    final result = await _authService.login(username, password);
    
    if (result['success']) {
      _user = result['user'];
    }

    _isLoading = false;
    notifyListeners();
    return result;
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    notifyListeners();
  }

  Future<void> checkAuth() async {
    _isLoading = true;
    notifyListeners();

    _user = await _authService.getMe();

    _isLoading = false;
    notifyListeners();
  }
}
