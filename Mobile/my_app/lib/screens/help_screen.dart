import 'package:flutter/material.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});
  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final _formKey = GlobalKey<FormState>();
  String name = '', email = '', message = '';

  final List<Map<String, String>> faqs = [
    {
      'question': 'How do I reset my password?',
      'answer': "Go to the login page and tap 'Forgot Password', then follow the email steps."
    },
    {
      'question': 'What are the limitations of the free plan?',
      'answer': 'Free plans include limited access to some features and lower usage limits.'
    },
    {
      'question': 'How can I upgrade my subscription?',
      'answer': 'Go to Settings > Subscription and choose a plan to upgrade.'
    },
  ];

  final List<Map<String, dynamic>> quickTips = [
    {'icon': Icons.wifi, 'text': 'Check your internet connection'},
    {'icon': Icons.restart_alt, 'text': 'Restart the app'},
    {'icon': Icons.delete_outline, 'text': 'Clear app cache'},
  ];

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Help', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Frequently Asked Questions', style: tt.titleMedium),
          const SizedBox(height: 8),
          ...faqs.map((faq) => _faqTile(context, faq['question']!, faq['answer']!)),
          const SizedBox(height: 24),
          Text('Contact Support', style: tt.titleMedium),
          const SizedBox(height: 8),
          _contactForm(context),
          const SizedBox(height: 24),
          Text('Quick Troubleshooting', style: tt.titleMedium),
          const SizedBox(height: 8),
          ...quickTips.map((tip) => ListTile(
                leading: Icon(tip['icon'], color: cs.onSurfaceVariant),
                title: Text(tip['text']),
                onTap: () {},
              )),
        ],
      ),
    );
  }

  Widget _faqTile(BuildContext context, String question, String answer) {
    final cs = Theme.of(context).colorScheme;
    return Theme(
      data: Theme.of(context).copyWith(
        expansionTileTheme: ExpansionTileThemeData(
          collapsedBackgroundColor: cs.surfaceContainerLowest,
          backgroundColor: cs.surfaceContainerHighest,
          collapsedIconColor: cs.onSurfaceVariant,
          iconColor: cs.onSurfaceVariant,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          collapsedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      child: ExpansionTile(
        title: Text(question),
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
            child: Text(answer, style: TextStyle(color: cs.onSurfaceVariant)),
          ),
        ],
      ),
    );
  }

  Widget _contactForm(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          _inputField(label: 'Name', hint: 'Enter your name', onChanged: (v) => name = v),
          const SizedBox(height: 8),
          _inputField(label: 'Email', hint: 'Enter your email', onChanged: (v) => email = v),
          const SizedBox(height: 8),
          _inputField(label: 'Message', hint: 'Enter your message', maxLines: 4, onChanged: (v) => message = v),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Message submitted!')));
                }
              },
              child: const Text('Submit'),
            ),
          )
        ],
      ),
    );
  }

  Widget _inputField({
    required String hint,
    required String label,
    required Function(String) onChanged,
    int maxLines = 1,
  }) {
    // final cs = Theme.of(context).colorScheme; // ✅ FIXED: Removed unused variable
    return TextFormField(
      onChanged: onChanged,
      maxLines: maxLines,
      validator: (val) => val == null || val.isEmpty ? 'Required' : null,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        filled: true,
        // fillColor: cs.surfaceContainerHighest, // This variable was removed. 
        // We'll let the default theme handle the color.
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}