import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'core/api.dart';
import 'features/auth/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/main_scaffold.dart';

final authService = AuthService();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Api.instance.init();
  await authService.init();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late final GoRouter _router;
  ThemeMode _themeMode = ThemeMode.system; // ✅ State for managing theme

  void _setThemeMode(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  @override
  void initState() {
    super.initState();
    _router = GoRouter(
      refreshListenable: authService.authNotifier,
      initialLocation: '/login',
      routes: [
        // ✅ Pass the theme state down to the main scaffold
        GoRoute(
          path: '/',
          builder: (_, __) => MainScaffold(
            themeMode: _themeMode,
            onThemeChanged: _setThemeMode,
          ),
        ),
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      ],
      redirect: (ctx, state) {
        final isAuthenticated = authService.authNotifier.value;
        final isLoggingIn = state.matchedLocation == '/login';
        if (!isAuthenticated && !isLoggingIn) return '/login';
        if (isAuthenticated && isLoggingIn) return '/';
        return null;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode, // ✅ Use the state here
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue, brightness: Brightness.light),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue, brightness: Brightness.dark),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}