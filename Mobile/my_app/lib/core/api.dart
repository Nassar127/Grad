import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'constants.dart';

class Api {
  Api._();
  static final instance = Api._();

  final _dio = Dio(BaseOptions(
    baseUrl: AppConst.apiBase,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 20),
    headers: {'Content-Type': 'application/json'},
  ));

  final _storage = const FlutterSecureStorage();
  static const _kAccess = 'accessToken';
  static const _kRefresh = 'refreshToken';

  Future<void> init() async {
    // Attach auth header if token exists
    final token = await _storage.read(key: _kAccess);
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    }

    // Auto-refresh on 401
    _dio.interceptors.add(
      InterceptorsWrapper(
        onError: (e, handler) async {
          if (e.response?.statusCode == 401) {
            final ok = await _tryRefresh();
            if (ok) {
              // retry original
              final req = e.requestOptions;
              final res = await _dio.fetch(req);
              return handler.resolve(res);
            }
          }
          return handler.next(e);
        },
      ),
    );
  }

  Dio get client => _dio;

  Future<bool> _tryRefresh() async {
    final refresh = await _storage.read(key: _kRefresh);
    if (refresh == null) return false;
    try {
      final res = await _dio.post('/auth/refresh', data: {'refreshToken': refresh});
      final access = res.data['accessToken'] as String?;
      final newRefresh = res.data['refreshToken'] as String?;
      if (access != null) {
        await _storage.write(key: _kAccess, value: access);
        _dio.options.headers['Authorization'] = 'Bearer $access';
      }
      if (newRefresh != null) {
        await _storage.write(key: _kRefresh, value: newRefresh);
      }
      return true;
    } catch (_) {
      await logout();
      return false;
    }
  }

  Future<void> saveTokens(String access, String refresh) async {
    await _storage.write(key: _kAccess, value: access);
    await _storage.write(key: _kRefresh, value: refresh);
    _dio.options.headers['Authorization'] = 'Bearer $access';
  }

  Future<void> logout() async {
    final refresh = await _storage.read(key: _kRefresh);
    try {
      if (refresh != null) {
        await _dio.post('/auth/logout', data: {'refreshToken': refresh});
      }
    } catch (_) {}
    await _storage.delete(key: _kAccess);
    await _storage.delete(key: _kRefresh);
    _dio.options.headers.remove('Authorization');
  }

  Future<bool> hasToken() async {
    final t = await _storage.read(key: _kAccess);
    return t != null;
  }
}
