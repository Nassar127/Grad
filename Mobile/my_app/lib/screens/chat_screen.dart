// lib/screens/chat_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'dart:async';
import '../core/api.dart';
import '../main.dart';
import '../widgets/app_drawer.dart';

enum ChatMode { medicalQuestions, conditionExplainer, studyRecommender }

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  ChatMode _chatMode = ChatMode.medicalQuestions;
  int? _currentChatId;
  List<dynamic> _messages = [];
  bool _loading = false;
  bool _sending = false;
  String _userName = 'there';

  List<String> _recommendations = [];

  @override
  void initState() {
    super.initState();
    _fetchUserName();
  }

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  String _getChatModeDisplayName(ChatMode mode) {
    switch (mode) {
      case ChatMode.medicalQuestions:
        return 'Medical Questions';
      case ChatMode.conditionExplainer:
        return 'Condition Explainer';
      case ChatMode.studyRecommender:
        return 'Study Recommender';
    }
  }

  Future<void> _fetchUserName() async {
    try {
      final user = await authService.me();
      if (mounted && user?['name'] != null) {
        setState(() => _userName = user!['name']);
      }
    } catch (_) {}
  }

  Future<void> _loadChat(int chatId) async {
    setState(() {
      _currentChatId = chatId;
      _loading = true;
      _messages = [];
      _recommendations = [];
    });
    try {
      final res = await Api.instance.client.get('/chats/$chatId/messages', queryParameters: {'take': 100});
      if (!mounted) return;

      final chatData = res.data['chat'] as Map<String, dynamic>;
      final chatModeName = chatData['mode'] ?? 'MedicalQuestions';
      final newMode = ChatMode.values.firstWhere(
            (e) => e.name.toLowerCase() == chatModeName.toLowerCase(),
        orElse: () => ChatMode.medicalQuestions,
      );

      setState(() {
        _messages = res.data['items'] as List<dynamic>;
        _loading = false;
        _chatMode = newMode;
      });

      _jumpBottom();

      if (_chatMode == ChatMode.studyRecommender && _messages.length > 2) {
        _fetchRecommendations(chatId);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to load chat: $e')));
    }
  }

  Future<int?> _createNewChatIfNeeded() async {
    if (_currentChatId != null) return _currentChatId;

    try {
      final res = await Api.instance.client.post('/chats', data: {'title': 'New Mobile Chat'});
      if (!mounted) return null;
      final id = res.data['chat']['id'] as int;
      setState(() {
        _currentChatId = id;
        _loading = false;
        _messages = [];
      });
      return id;
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to create new chat: $e')));
      }
      return null;
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

    setState(() {
      _sending = true;
      _recommendations = [];
    });

    final chatId = await _createNewChatIfNeeded();
    if (chatId == null) {
      setState(() => _sending = false);
      return;
    }

    _controller.clear();

    try {
      final res = await Api.instance.client.post('/chats/$chatId/messages', data: {
        'text': text,
        'mode': _chatMode.name,
      });
      final userMsg = res.data['userMessage'];
      final botMsg = res.data['botMessage'];
      setState(() {
        _messages.addAll([userMsg, botMsg]);
      });
      _jumpBottom();

      if (_chatMode == ChatMode.studyRecommender && _messages.length > 2) {
        _fetchRecommendations(chatId);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Send failed: $e')));
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  // ✅ FIXED: Re-added the missing function
  Future<void> _fetchRecommendations(int chatId) async {
    try {
      final res = await Api.instance.client.get('/chats/$chatId/recommendations');
      final recommendations = (res.data['recommendations'] as List).cast<String>();
      if (mounted) {
        setState(() {
          _recommendations = recommendations;
        });
      }
    } catch (e) {
      debugPrint('Failed to fetch recommendations: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      drawer: AppDrawer(
        onNewChat: () => setState(() {
          _currentChatId = null;
          _messages = [];
          _recommendations = [];
        }),
        onChatSelected: _loadChat,
      ),
      appBar: AppBar(
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'MediLearn',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: Theme.of(context).appBarTheme.titleTextStyle?.color?.withAlpha(178),
              ),
            ),
            const SizedBox(height: 2),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface.withAlpha(38),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: DropdownButton<ChatMode>(
                    value: _chatMode,
                    underline: Container(),
                    isDense: true,
                    icon: const Icon(Icons.expand_more),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Theme.of(context).appBarTheme.titleTextStyle?.color,
                      fontWeight: FontWeight.bold,
                    ),
                    onChanged: (ChatMode? newValue) {
                      if (newValue != null && newValue != _chatMode) {
                        setState(() {
                          _chatMode = newValue;
                          _currentChatId = null;
                          _messages = [];
                          _recommendations = [];
                          _controller.clear();
                        });
                      }
                    },
                    items: ChatMode.values.map<DropdownMenuItem<ChatMode>>((ChatMode value) {
                      return DropdownMenuItem<ChatMode>(
                        value: value,
                        child: Text(_getChatModeDisplayName(value)),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                ? _buildWelcomeView()
                : _buildChatView(),
          ),
          if (_recommendations.isNotEmpty) _buildRecommendations(),
          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildChatView() {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return ListView.builder(
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
              decoration: BoxDecoration(color: cs.primaryContainer, borderRadius: BorderRadius.circular(12)),
              child: Text(m['text'] ?? '', style: tt.bodyMedium?.copyWith(color: cs.onPrimaryContainer)),
            ),
          );
        } else {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const CircleAvatar(radius: 16, backgroundImage: AssetImage('assets/logo.png')),
                const SizedBox(width: 8),
                Expanded(
                  child: MarkdownBody(
                    data: m['text'] ?? '',
                    styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)),
                  ),
                ),
              ],
            ),
          );
        }
      },
    );
  }

  Widget _buildRecommendations() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Related Topics',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8.0,
            runSpacing: 4.0,
            children: _recommendations.map((rec) {
              return ActionChip(
                label: Text(rec),
                onPressed: () {
                  _controller.text = rec;
                  _send();
                },
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeView() {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Center(
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
              'How can I help you today?',
              style: tt.bodyLarge?.copyWith(color: cs.onSurfaceVariant),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              decoration: const InputDecoration(
                hintText: 'Type a message...',
                filled: true,
                border: OutlineInputBorder(borderSide: BorderSide.none, borderRadius: BorderRadius.all(Radius.circular(24))),
              ),
              onSubmitted: (_) => _send(),
            ),
          ),
          const SizedBox(width: 8),
          IconButton.filled(
            icon: _sending
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.send),
            onPressed: _sending ? null : _send,
          ),
        ],
      ),
    );
  }
}