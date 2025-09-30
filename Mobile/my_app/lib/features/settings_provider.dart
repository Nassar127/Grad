// lib/features/settings_provider.dart

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:my_app/main.dart'; // To access authService

// A simple model for our user
class UserModel {
  final String name;
  final String email;
  final String? phone;
  final String role;
  UserModel({required this.name, required this.email, this.phone, required this.role});
}

class SettingsProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;
  Locale _locale = const Locale('en');
  UserModel? _user;

  ThemeMode get themeMode => _themeMode;
  Locale get locale => _locale;
  UserModel? get user => _user;


  SettingsProvider() {
    _loadSettings();
    loadUser();
  }

  Future<void> loadUser() async {
    final userData = await authService.me();
    if (userData != null) {
      _user = UserModel(
        name: userData['name'] ?? 'No Name',
        email: userData['email'] ?? 'No Email',
        phone: userData['phone'],
        role: userData['role'] ?? 'viewer',
      );
      notifyListeners();
    }
  }

  // Load saved theme and language from device storage
  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final themeIndex = prefs.getInt('themeMode') ?? ThemeMode.system.index;
    final langCode = prefs.getString('languageCode') ?? 'en';

    _themeMode = ThemeMode.values[themeIndex];
    _locale = Locale(langCode);
    notifyListeners();
  }

  // Update and save the theme
  Future<void> updateThemeMode(ThemeMode mode) async {
    if (mode == _themeMode) return;
    _themeMode = mode;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('themeMode', mode.index);
  }

  // Update and save the language
  Future<void> updateLocale(Locale newLocale) async {
    if (newLocale == _locale) return;
    _locale = newLocale;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', newLocale.languageCode);
  }
}