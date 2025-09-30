// lib/main.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart'; // 1. Import provider
import 'core/api.dart';
import 'features/auth/auth_service.dart';
import 'features/settings_provider.dart'; // 2. Import your new provider
import 'screens/login_screen.dart';
import 'screens/chat_screen.dart';

final authService = AuthService();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Api.instance.init();
  await authService.init();
  // 3. Wrap your app in the provider
  runApp(
    ChangeNotifierProvider(
      create: (_) => SettingsProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget { // 4. MyApp can now be stateless
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 5. Access the provider to get the theme
    final settingsProvider = Provider.of<SettingsProvider>(context);

    final router = GoRouter(
      refreshListenable: authService.authNotifier,
      initialLocation: '/',
      routes: [
        GoRoute(path: '/', builder: (_, __) => const ChatScreen()),
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

    final lightTheme = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue, brightness: Brightness.light),
      useMaterial3: true,
    );
    final darkTheme = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue, brightness: Brightness.dark),
      useMaterial3: true,
    );

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      themeMode: settingsProvider.themeMode, // 6. Use theme from provider
      theme: lightTheme.copyWith(
        dropdownMenuTheme: DropdownMenuThemeData(
          menuStyle: MenuStyle(
            backgroundColor: WidgetStateProperty.all(lightTheme.colorScheme.surfaceContainer),
            shape: WidgetStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          ),
        ),
      ),
      darkTheme: darkTheme.copyWith(
        dropdownMenuTheme: DropdownMenuThemeData(
          menuStyle: MenuStyle(
            backgroundColor: WidgetStateProperty.all(darkTheme.colorScheme.surfaceContainer),
            shape: WidgetStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          ),
        ),
      ),
      routerConfig: router,
    );
  }
}