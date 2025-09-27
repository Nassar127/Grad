// lib/screens/profile_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/auth_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _auth = AuthService();
  Map<String, dynamic>? _user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchUser();
  }

  Future<void> _fetchUser() async {
    try {
      final user = await _auth.me();
      if (mounted) {
        setState(() {
          _user = user;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to fetch profile: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _user == null
          ? const Center(child: Text('Could not load user profile.'))
          : ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 40,
              backgroundImage: NetworkImage('https://api.dicebear.com/7.x/personas/svg?seed=flutter'),
            ),
          ),
          const SizedBox(height: 12),
          Center(child: Text(_user?['name'] ?? 'No Name', style: tt.titleMedium?.copyWith(fontWeight: FontWeight.bold))),
          const SizedBox(height: 4),
          Center(child: Text(_user?['email'] ?? '', style: TextStyle(color: cs.onSurfaceVariant))),
          const SizedBox(height: 24),
          const Divider(),
          _infoTile(context, 'Account Type', _user?['role'] ?? 'viewer'),
          const Divider(),
          const SizedBox(height: 32),
          FilledButton.icon(
            // This onPressed handler now includes the `async` fix
            onPressed: () async {
              await _auth.logout();
              if (context.mounted) {
                context.go('/login');
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Logged out!')));
              }
            },
            icon: const Icon(Icons.logout),
            label: const Text('Log Out'),
            style: FilledButton.styleFrom(
              backgroundColor: cs.errorContainer,
              foregroundColor: cs.onErrorContainer,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoTile(BuildContext context, String label, String value) {
    final cs = Theme.of(context).colorScheme;
    return ListTile(
      title: Text(label, style: TextStyle(color: cs.onSurfaceVariant)),
      subtitle: Text(value, style: Theme.of(context).textTheme.bodyLarge),
      contentPadding: EdgeInsets.zero,
    );
  }
}