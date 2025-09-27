import 'package:flutter/material.dart';
import 'dart:async';
import '../core/api.dart';
import '../main.dart';

class ChatDetailScreen extends StatefulWidget {
  final int chatId;
  const ChatDetailScreen({super.key, required this.chatId});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  List<dynamic> _messages = [];
  bool _loading = true;
  bool _sending = false;
  String _userName = 'there';

  @override
  void initState() {
    super.initState();
    _load();
    _fetchUserName();
  }

  Future<void> _fetchUserName() async {
    try {
      final user = await authService.me();
      if (mounted && user?['name'] != null) {
        setState(() {
          _userName = user!['name'];
        });
      }
    } catch (_) {
    }
  }

  Future<void> _load() async {
    try {
      final res =
          await Api.instance.client.get('/chats/${widget.chatId}/messages', queryParameters: {'take': 100});
      if (!mounted) return;
      setState(() {
        _messages = res.data['items'] as List<dynamic>;
        _loading = false;
      });
      _jumpBottom();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to load: $e')));
    }
  }

  void _jumpBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.jumpTo(_scroll.position.maxScrollExtent);
      }
    });
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() => _sending = true);
    try {
      final res = await Api.instance.client.post('/chats/${widget.chatId}/messages', data: {'text': text});
      final userMsg = res.data['userMessage'];
      final botMsg = res.data['botMessage'];
      setState(() {
        _messages.addAll([userMsg, botMsg]);
        _controller.clear();
      });
      _jumpBottom();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Send failed: $e')));
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('New Chat')),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : Stack(
                    children: [
                      ListView.builder(
                        controller: _scroll,
                        padding: const EdgeInsets.all(16),
                        itemCount: _messages.length,
                        itemBuilder: (_, i) {
                          final m = _messages[i] as Map<String, dynamic>;
                          final isUser = (m['sender'] as String?) == 'USER';
                          
                          if (isUser) {
                            return Align(
                              alignment: Alignment.centerRight,
                              child: Container(
                                margin: const EdgeInsets.symmetric(vertical: 4),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                    color: cs.primaryContainer,
                                    borderRadius: BorderRadius.circular(12)),
                                child: Text(m['text'] ?? '',
                                    style: tt.bodyMedium?.copyWith(color: cs.onPrimaryContainer)),
                              ),
                            );
                          } else {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4.0),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const CircleAvatar(
                                    radius: 16,
                                    backgroundImage: AssetImage('assets/logo.png'),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'MediLearn AI Assistant',
                                          style: tt.bodySmall?.copyWith(fontWeight: FontWeight.bold),
                                        ),
                                        const SizedBox(height: 4),
                                        Container(
                                          padding: const EdgeInsets.all(12),
                                          decoration: BoxDecoration(
                                              color: cs.surfaceContainerHighest,
                                              borderRadius: BorderRadius.circular(12)),
                                          child: Text(m['text'] ?? '',
                                              style: tt.bodyMedium?.copyWith(color: cs.onSurface)),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }
                        },
                      ),
                      if (_messages.isEmpty)
                        Center(
                          child: Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                CircleAvatar(
                                  radius: 32,
                                  backgroundImage: const AssetImage('assets/logo.png'),
                                  backgroundColor: cs.surfaceContainerHighest,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Hello $_userName!',
                                  style: tt.headlineSmall,
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'What medical questions can I help you with?',
                                  style: tt.bodyLarge?.copyWith(color: cs.onSurfaceVariant),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: 'Type a message',
                      filled: true,
                      border: OutlineInputBorder(
                          borderSide: BorderSide.none, borderRadius: BorderRadius.all(Radius.circular(12))),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: _sending
                      ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.send),
                  onPressed: _sending ? null : _send,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}