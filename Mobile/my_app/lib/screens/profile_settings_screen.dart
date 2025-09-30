// lib/screens/profile_settings_screen.dart

import 'package:flutter/material.dart';
import 'package:my_app/core/api.dart';
import 'package:provider/provider.dart';
import '../features/settings_provider.dart';

class ProfileSettingsScreen extends StatefulWidget {
  const ProfileSettingsScreen({super.key});
  @override
  State<ProfileSettingsScreen> createState() => _ProfileSettingsScreenState();
}

class _ProfileSettingsScreenState extends State<ProfileSettingsScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<SettingsProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      _phoneController.text = user.phone ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    setState(() => _isLoading = true);
    final settingsProvider = Provider.of<SettingsProvider>(context, listen: false);
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);

    try {
      // ✅ 1. Ensure the API client has the auth token before making a call
      await Api.instance.init();
      await Api.instance.client.post('/auth/me/update-name', data: {
        'name': _nameController.text,
        // You can add phone update logic here as well
      });

      await settingsProvider.loadUser();

      scaffoldMessenger.showSnackBar(
        const SnackBar(content: Text('Profile updated successfully!')),
      );
      navigator.pop();
    } catch (e) {
      scaffoldMessenger.showSnackBar(
        SnackBar(content: Text('Failed to update profile: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showChangePasswordDialog() {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        final scaffoldMessenger = ScaffoldMessenger.of(context);
        final navigator = Navigator.of(context);

        return AlertDialog(
          title: const Text('Change Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: currentPasswordController, decoration: const InputDecoration(labelText: 'Current Password'), obscureText: true),
              TextField(controller: newPasswordController, decoration: const InputDecoration(labelText: 'New Password'), obscureText: true),
            ],
          ),
          actions: [
            TextButton(onPressed: () => navigator.pop(), child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                try {
                  // ✅ 2. Ensure the API client has the auth token here too
                  await Api.instance.init();
                  await Api.instance.client.post('/auth/me/change-password', data: {
                    'currentPassword': currentPasswordController.text,
                    'newPassword': newPasswordController.text,
                  });
                  scaffoldMessenger.showSnackBar(
                    const SnackBar(content: Text('Password changed successfully.')),
                  );
                  navigator.pop();
                } catch (e) {
                  scaffoldMessenger.showSnackBar(
                    SnackBar(content: Text('Failed: $e')),
                  );
                }
              },
              child: const Text('Confirm'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Name', border: OutlineInputBorder(), prefixIcon: Icon(Icons.person_outline)),
          ),
          const SizedBox(height: 16),
          TextFormField(
            initialValue: settings.user?.email ?? 'Not set',
            readOnly: true,
            decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder(), prefixIcon: Icon(Icons.email_outlined)),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _phoneController,
            decoration: const InputDecoration(labelText: 'Phone Number', border: OutlineInputBorder(), prefixIcon: Icon(Icons.phone_outlined)),
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            icon: const Icon(Icons.lock_outline),
            label: const Text('Change Password'),
            onPressed: _showChangePasswordDialog,
            style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: FilledButton(
          onPressed: _saveProfile,
          child: const Text('Save Changes'),
        ),
      ),
    );
  }
}