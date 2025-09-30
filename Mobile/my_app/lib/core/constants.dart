class AppConst {
  static const apiBase = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'https://medilearn-api.onrender.com',
  );
}