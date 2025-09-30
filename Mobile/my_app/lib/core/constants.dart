class AppConst {
  static const apiBase = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'https://medilearn-api.onrender.com',
    // defaultValue: 'http://10.0.2.2:4000',
  );
}