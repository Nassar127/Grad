// lib/features/auth_service.dart

import 'package:flutter/foundation.dart';
import '../../core/api.dart';

class AuthService {
  final _api = Api.instance;
  final authNotifier = ValueNotifier<bool>(false);

  Future<void> init() async {
    final hasToken = await _api.hasToken();
    authNotifier.value = hasToken;
  }

  Future<void> signup(String email, String phone, String password, String name) async {
    final res = await _api.client.post('/auth/signup', data: {
      'email': email.isEmpty ? null : email,
      'phone': phone.isEmpty ? null : phone,
      'password': password,
      'name': name,
    });
    // ... rest is the same
    final access = res.data['accessToken'] as String;
    final refresh = res.data['refreshToken'] as String;
    await _api.saveTokens(access, refresh);
    authNotifier.value = true;
  }

  Future<void> login(String login, String password) async {
    final res = await _api.client.post('/auth/login', data: {
      'login': login,
      'password': password,
    });
    // ... rest is the same
    final access = res.data['accessToken'] as String;
    final refresh = res.data['refreshToken'] as String;
    await _api.saveTokens(access, refresh);
    authNotifier.value = true;
  }

  Future<Map<String, dynamic>?> me() async {
    final res = await _api.client.get('/auth/me');
    return res.data['user'] as Map<String, dynamic>?;
  }

  Future<void> logout() async {
    await _api.logout();
    authNotifier.value = false;
  }
}