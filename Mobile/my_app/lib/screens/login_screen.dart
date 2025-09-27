import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../main.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLogin = true;
  bool _loading = false;

  String email = '';
  String password = '';
  String name = '';

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: ListView(
                  shrinkWrap: true,
                  children: [
                    const SizedBox(height: 24),
                    Icon(Icons.lock_outline, size: 48, color: cs.primary),
                    const SizedBox(height: 16),
                    Text(_isLogin ? 'Welcome back' : 'Create account',
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 24),
                    if (!_isLogin)
                      TextFormField(
                        decoration: const InputDecoration(labelText: 'Name'),
                        onChanged: (v) => name = v.trim(),
                        validator: (v) => _isLogin ? null : (v == null || v.isEmpty ? 'Required' : null),
                        textInputAction: TextInputAction.next,
                      ),
                    const SizedBox(height: 12),
                    TextFormField(
                      decoration: const InputDecoration(labelText: 'Email'),
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (v) => email = v.trim(),
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.email],
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      decoration: const InputDecoration(labelText: 'Password'),
                      obscureText: true,
                      onChanged: (v) => password = v,
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      autofillHints: const [AutofillHints.password],
                    ),
                    const SizedBox(height: 20),
                    FilledButton(
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : Text(_isLogin ? 'Login' : 'Sign Up'),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: _loading ? null : () => setState(() => _isLogin = !_isLogin),
                      child: Text(_isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      if (_isLogin) {
        await authService.login(email, password);
      } else {
        await authService.signup(email, password, name);
      }

      if (!mounted) return;
      context.go('/');

    } on DioException catch (e) { // ✅ 2. Catch DioException specifically
      if (!mounted) return;

      String errorMessage = 'An unknown error occurred.';
      // ✅ 3. Check for the 409 status code
      if (e.response?.statusCode == 409) {
        errorMessage = 'This email address is already in use.';
      } else {
        // You can add more checks here for other status codes, like 401 for bad passwords
        errorMessage = 'Authentication failed. Please check your credentials.';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An unexpected error occurred: $e')),
      );
    }
    finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}