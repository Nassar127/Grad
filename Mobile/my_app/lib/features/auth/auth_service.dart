import 'package:flutter/foundation.dart';
import '../../core/api.dart';

class AuthService {
  final _api = Api.instance;

  // ✅ Notifier to broadcast authentication changes
  final authNotifier = ValueNotifier<bool>(false);

  Future<void> init() async {
    final hasToken = await _api.hasToken();
    authNotifier.value = hasToken;
  }

  Future<Map<String, dynamic>> signup(String email, String password, String name) async {
    final res = await _api.client.post('/auth/signup', data: {
      'email': email,
      'password': password,
      'name': name,
    });
    final access = res.data['accessToken'] as String;
    final refresh = res.data['refreshToken'] as String;
    await _api.saveTokens(access, refresh);
    authNotifier.value = true; // ✅ Notify app of login
    return res.data['user'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _api.client.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final access = res.data['accessToken'] as String;
    final refresh = res.data['refreshToken'] as String;
    await _api.saveTokens(access, refresh);
    authNotifier.value = true; // ✅ Notify app of login
    return res.data['user'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>?> me() async {
    final res = await _api.client.get('/auth/me');
    return res.data['user'] as Map<String, dynamic>?;
  }

  Future<void> logout() async {
    await _api.logout();
    authNotifier.value = false; // ✅ Notify app of logout
  }
}