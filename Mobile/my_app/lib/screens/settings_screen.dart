import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeChanged;

  const SettingsScreen({
    super.key,
    required this.themeMode,
    required this.onThemeChanged,
  });

  String get _themeLabel {
    switch (themeMode) {
      case ThemeMode.light:
        return 'Light';
      case ThemeMode.dark:
        return 'Dark';
      case ThemeMode.system:
        return 'System';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _sectionTitle(context, 'Preferences'),
          SwitchListTile(
            title: const Text('Notifications'),
            subtitle: const Text('Receive notifications for new messages and updates'),
            value: false,
            onChanged: (_) {},
          ),
          _tile(
            title: 'Language',
            subtitle: 'Choose your preferred language',
            trailing: 'English',
            onTap: () {},
          ),
          _tile(
            title: 'Theme',
            subtitle: 'Switch between light and dark themes',
            trailing: _themeLabel, // shows current mode
            onTap: () => _showThemePicker(context),
          ),

          const SizedBox(height: 24),
          _sectionTitle(context, 'Profile'),
          _tile(
            title: 'Profile Info',
            subtitle: 'Update your profile information',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String title) => Padding(
    padding: const EdgeInsets.only(bottom: 8.0, top: 16.0),
    child: Text(title, style: Theme.of(context).textTheme.titleMedium),
  );

  Widget _tile({
    required String title,
    required String subtitle,
    String? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      onTap: onTap,
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: trailing != null ? Text(trailing) : const Icon(Icons.arrow_forward_ios, size: 16),
    );
  }

  void _showThemePicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      builder: (ctx) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<ThemeMode>(
                title: const Text('Light'),
                value: ThemeMode.light,
                groupValue: themeMode,
                onChanged: (val) {
                  if (val != null) onThemeChanged(val);
                  Navigator.pop(ctx);
                },
              ),
              RadioListTile<ThemeMode>(
                title: const Text('Dark'),
                value: ThemeMode.dark,
                groupValue: themeMode,
                onChanged: (val) {
                  if (val != null) onThemeChanged(val);
                  Navigator.pop(ctx);
                },
              ),
              RadioListTile<ThemeMode>(
                title: const Text('System'),
                value: ThemeMode.system,
                groupValue: themeMode,
                onChanged: (val) {
                  if (val != null) onThemeChanged(val);
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
