// lib/screens/signup_screen.dart

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:my_app/main.dart';
import 'package:provider/provider.dart';
import '../features/settings_provider.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String phone = '';
  String password = '';
  String name = '';
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(24.0),
          children: [
            TextFormField(decoration: const InputDecoration(labelText: 'Name'), onChanged: (v) => name = v.trim()),
            const SizedBox(height: 12),
            TextFormField(decoration: const InputDecoration(labelText: 'Email (Optional)'), onChanged: (v) => email = v.trim()),
            const SizedBox(height: 12),
            TextFormField(decoration: const InputDecoration(labelText: 'Phone (Optional)'), onChanged: (v) => phone = v.trim()),
            const SizedBox(height: 12),
            TextFormField(decoration: const InputDecoration(labelText: 'Password'), obscureText: true, onChanged: (v) => password = v, validator: (v) => (v == null || v.isEmpty) ? 'Required' : null),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _loading ? null : _submit,
              child: _loading ? const CircularProgressIndicator() : const Text('Sign Up'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);

    // ✅ FIX: Capture context-dependent variables before the async gap
    final settingsProvider = Provider.of<SettingsProvider>(context, listen: false);
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final router = GoRouter.of(context);

    try {
      await authService.signup(email, phone, password, name);

      // Refresh user data before navigating
      await settingsProvider.loadUser();

      router.go('/');
    } on DioException catch (e) {
      String message = 'An unknown error occurred.';
      if (e.response?.statusCode == 409) {
        message = 'This email or phone number is already in use.';
      } else {
        message = 'Signup failed. Please try again later.';
      }
      scaffoldMessenger.showSnackBar(SnackBar(content: Text(message)));
    } catch (e) {
      scaffoldMessenger.showSnackBar(SnackBar(content: Text('Signup failed: $e')));
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }
}