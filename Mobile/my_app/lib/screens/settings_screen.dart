// lib/screens/settings_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:my_app/main.dart';
import 'package:my_app/screens/billing_screen.dart';
import 'package:my_app/screens/help_screen.dart'; // ✅ 3. Import the HelpScreen
import 'package:my_app/screens/profile_settings_screen.dart';
import 'package:provider/provider.dart';
import '../core/string_extension.dart';
import '../features/settings_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<SettingsProvider>(
      builder: (context, settings, child) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Settings'),
            centerTitle: true,
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _SettingsHeader(user: settings.user),
              const SizedBox(height: 16),

              _SettingsSection(
                tiles: [
                  _SettingsTile(
                    icon: Icons.person_outline,
                    title: 'Profile',
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ProfileSettingsScreen()),
                    ),
                  ),
                  _SettingsTile(
                    icon: Icons.receipt_long_outlined,
                    title: 'Billing',
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const BillingScreen()),
                    ),
                  ),
                ],
              ),

              // ✅ 1. REMOVED: The entire "Permissions" section is gone.

              _SettingsSection(
                tiles: [
                  _SettingsTile(
                    icon: Icons.brightness_6_outlined,
                    title: 'Theme',
                    trailing: Text(settings.themeMode.name.capitalize()),
                    onTap: () => _showThemePicker(context, settings),
                  ),
                  // ✅ 2. HIDDEN: The Language tile is commented out for later use.
                  // _SettingsTile(
                  //   icon: Icons.language_outlined,
                  //   title: 'Language',
                  //   trailing: Text(settings.locale.languageCode == 'ar' ? 'العربية' : 'English'),
                  //   onTap: () => _showLanguagePicker(context, settings),
                  // ),
                ],
              ),
              _SettingsSection(
                tiles: [
                  _SettingsTile(
                    icon: Icons.help_outline,
                    title: 'Help',
                    // ✅ 3. FIXED: The Help button now navigates to the HelpScreen.
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const HelpScreen()),
                    ),
                  ),
                  _SettingsTile(
                    icon: Icons.logout,
                    title: 'Log out',
                    onTap: () async {
                      final goRouter = GoRouter.of(context);
                      await authService.logout();
                      goRouter.go('/login');
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // ... dialog and picker functions remain the same ...
  void _showThemePicker(BuildContext context, SettingsProvider settings) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          RadioListTile<ThemeMode>(
            title: const Text('Light'),
            value: ThemeMode.light,
            groupValue: settings.themeMode,
            onChanged: (val) {
              settings.updateThemeMode(val!);
              Navigator.pop(ctx);
            },
          ),
          RadioListTile<ThemeMode>(
            title: const Text('Dark'),
            value: ThemeMode.dark,
            groupValue: settings.themeMode,
            onChanged: (val) {
              settings.updateThemeMode(val!);
              Navigator.pop(ctx);
            },
          ),
          RadioListTile<ThemeMode>(
            title: const Text('System'),
            value: ThemeMode.system,
            groupValue: settings.themeMode,
            onChanged: (val) {
              settings.updateThemeMode(val!);
              Navigator.pop(ctx);
            },
          ),
        ],
      ),
    );
  }
}

class _SettingsHeader extends StatelessWidget {
  final UserModel? user;
  const _SettingsHeader({this.user});

  @override
  Widget build(BuildContext context) {
    if (user == null) {
      return const SizedBox(height: 50);
    }
    return Center(
      child: Column(
        children: [
          Text(user!.email, style: Theme.of(context).textTheme.bodyLarge),
          // ✅ 4. REMOVED: The "Viewer" Chip widget is gone.
        ],
      ),
    );
  }
}

class _SettingsSection extends StatelessWidget {
  final List<_SettingsTile> tiles;
  const _SettingsSection({required this.tiles});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Column(children: tiles),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget? trailing;
  final VoidCallback onTap;

  const _SettingsTile({required this.icon, required this.title, this.trailing, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: trailing,
      onTap: onTap,
    );
  }
}