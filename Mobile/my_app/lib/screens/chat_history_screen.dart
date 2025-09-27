import 'package:flutter/material.dart';
import 'chat_detail_screen.dart';
import 'dart:async';
import '../core/api.dart';

class ChatHistoryScreen extends StatefulWidget {
  const ChatHistoryScreen({super.key});
  @override
  State<ChatHistoryScreen> createState() => _ChatHistoryScreenState();
}

class _ChatHistoryScreenState extends State<ChatHistoryScreen> {
  List<dynamic> _chats = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadChats();
  }

  Future<void> _loadChats() async {
    if (_isLoading) return;
    setState(() => _isLoading = true);
    try {
      final res = await Api.instance.client.get('/chats', queryParameters: {'take': 50});
      if (mounted) {
        setState(() {
          _chats = (res.data['items'] as List<dynamic>);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load chats: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _createNewChat() async {
    final navigator = Navigator.of(context);
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    try {
      final res = await Api.instance.client.post('/chats', data: {'title': 'New Chat'});
      if (!mounted) return;
      
      final id = res.data['chat']['id'];
      
      await navigator.push(MaterialPageRoute(builder: (_) => ChatDetailScreen(chatId: id)));
      _loadChats();
      
    } catch (e) {
      scaffoldMessenger.showSnackBar(
        SnackBar(content: Text('Failed to create chat: $e')),
      );
    }
  }

  Future<void> _deleteChat(int chatId, int index) async {
    final chatToDelete = _chats[index];
    setState(() {
      _chats.removeAt(index);
    });

    try {
      await Api.instance.client.delete('/chats/$chatId');
    } catch (e) {
      if (mounted) {
        setState(() {
          _chats.insert(index, chatToDelete);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete chat: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chats', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: _createNewChat),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadChats,
        child: _isLoading && _chats.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _chats.isEmpty
                ? const Center(child: Text('No chats yet. Tap + to start.'))
                : ListView.builder(
                    itemCount: _chats.length,
                    itemBuilder: (_, i) {
                      final chat = _chats[i] as Map<String, dynamic>;
                      final chatId = chat['id'] as int;
                      
                      return Dismissible(
                        key: ValueKey(chatId),
                        direction: DismissDirection.endToStart,
                        onDismissed: (direction) {
                          _deleteChat(chatId, i);
                        },
                        background: Container(
                          color: Colors.red,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        child: ListTile(
                          title: Text(chat['title'] ?? 'Untitled'),
                          onTap: () async {
                            await Navigator.push(context,
                                MaterialPageRoute(builder: (_) => ChatDetailScreen(chatId: chatId)));
                            _loadChats();
                          },
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}