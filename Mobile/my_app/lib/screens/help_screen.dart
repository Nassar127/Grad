// lib/screens/help_screen.dart

import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:go_router/go_router.dart';
import 'package:my_app/main.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});
  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final List<Map<String, String>> faqs = [
    {
      'question': 'How do the different AI modes work?',
      'answer':
      "You can switch between modes in the header. 'Medical Questions' is for general queries. 'Condition Explainer' provides detailed summaries of medical conditions. 'Study Recommender' suggests topics based on your conversations."
    },
    {
      'question': 'Is my chat history private?',
      'answer':
      'Yes, your conversations are securely stored and are only accessible when you are logged into your account. We prioritize your privacy and data security.'
    },
    {
      'question': 'Can I delete a chat conversation?',
      'answer':
      'Currently, chat deletion is available on the web version of the app. We are working on bringing this feature to the mobile app soon.'
    },
  ];

  void _checkConnectivity() async {
    final connectivityResult = await (Connectivity().checkConnectivity());
    if (!mounted) return; // ✅ FIX: Check mounted *after* the await

    String title;
    String content;
    IconData icon;

    if (connectivityResult.contains(ConnectivityResult.mobile)) {
      title = 'Connected';
      content = 'You are connected to the internet via Mobile Data.';
      icon = Icons.signal_cellular_alt;
    } else if (connectivityResult.contains(ConnectivityResult.wifi)) {
      title = 'Connected';
      content = 'You are connected to the internet via Wi-Fi.';
      icon = Icons.wifi;
    } else {
      title = 'No Connection';
      content = 'No active network connection was detected.';
      icon = Icons.signal_wifi_off;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        icon: Icon(icon),
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionTitle('Troubleshooting', context),
          _buildActionTile(
            icon: Icons.network_check,
            title: 'Check Connection Status',
            onTap: _checkConnectivity,
          ),
          _buildActionTile(
            icon: Icons.logout,
            title: 'Re-authenticate',
            subtitle: 'Log out and log back in to refresh your session.',
            onTap: () async {
              // ✅ FIX: Handle async gap for navigation
              final goRouter = GoRouter.of(context);
              await authService.logout();
              goRouter.go('/login');
            },
          ),
          const SizedBox(height: 24),
          _buildSectionTitle('Get in Touch', context),
          _buildActionTile(
            icon: Icons.email_outlined,
            title: 'Email Support',
            subtitle: 'medi.learn.v2@gmail.com',
            onTap: () async {
              final Uri emailUri = Uri(
                scheme: 'mailto',
                path: 'medi.learn.v2@gmail.com',
                query: 'subject=${Uri.encodeComponent('MediLearn App Support')}',
              );
              if (await canLaunchUrl(emailUri)) {
                await launchUrl(emailUri);
              }
            },
          ),
          const SizedBox(height: 24),
          _buildSectionTitle('Frequently Asked Questions', context),
          ...faqs.map((faq) => _faqTile(context, faq['question']!, faq['answer']!)),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(title, style: Theme.of(context).textTheme.titleMedium),
    );
  }

  Widget _faqTile(BuildContext context, String question, String answer) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ExpansionTile(
        title: Text(question),
        collapsedBackgroundColor: cs.surfaceContainer,
        backgroundColor: cs.surfaceContainerHighest,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        collapsedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(answer, style: TextStyle(color: cs.onSurfaceVariant)),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: subtitle != null ? Text(subtitle) : null,
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}