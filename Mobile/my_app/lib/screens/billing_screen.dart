// lib/screens/billing_screen.dart

import 'package:flutter/material.dart';

class BillingScreen extends StatelessWidget {
  const BillingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Billing'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildPlanCard(
            context: context,
            title: 'Free Version',
            features: [
              'Standard AI model',
              'Limited chat history',
              'Community support',
            ],
            isCurrentPlan: true,
          ),
          const SizedBox(height: 16),
          _buildPlanCard(
            context: context,
            title: 'MediLearn Pro',
            features: [
              'Advanced AI model',
              'Unlimited chat history',
              'Priority email support',
              'Contextual Study Recommender',
            ],
            isCurrentPlan: false,
          ),
        ],
      ),
    );
  }

  Widget _buildPlanCard({
    required BuildContext context,
    required String title,
    required List<String> features,
    required bool isCurrentPlan,
  }) {
    final theme = Theme.of(context);
    return Card(
      elevation: isCurrentPlan ? 4 : 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: isCurrentPlan
            ? BorderSide(color: theme.colorScheme.primary, width: 2)
            : BorderSide.none,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            ...features.map((feature) => Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Row(
                children: [
                  Icon(Icons.check_circle_outline,
                      size: 20, color: theme.colorScheme.primary),
                  const SizedBox(width: 8),
                  Expanded(child: Text(feature)),
                ],
              ),
            )),
            const SizedBox(height: 16),
            if (isCurrentPlan)
              const Chip(label: Text('Current Plan'))
            else
              FilledButton(
                onPressed: () {
                  // Placeholder for upgrade flow
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Upgrade flow not implemented.')),
                  );
                },
                child: const Text('Upgrade to Pro'),
              ),
          ],
        ),
      ),
    );
  }
}