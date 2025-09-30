// lib/widgets/app_drawer.dart

import 'package:flutter/material.dart';
import 'package:my_app/screens/settings_screen.dart';
import 'package:provider/provider.dart';
import '../core/api.dart';
import '../features/settings_provider.dart';
// ✅ REMOVED: Unused import of chat_detail_screen.dart

class AppDrawer extends StatefulWidget {
  final VoidCallback onNewChat;
  final ValueChanged<int> onChatSelected;

  const AppDrawer({
    super.key,
    required this.onNewChat,
    required this.onChatSelected,
  });

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  List<dynamic> _allChats = [];
  List<dynamic> _filteredChats = [];
  bool _isLoading = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadChats();
    _searchController.addListener(_filterChats);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterChats() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredChats = _allChats.where((chat) {
        final title = (chat['title'] as String?)?.toLowerCase() ?? '';
        return title.contains(query);
      }).toList();
    });
  }

  Future<void> _loadChats() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      final res = await Api.instance.client.get('/chats', queryParameters: {'take': 100});
      if (mounted) {
        setState(() {
          _allChats = (res.data['items'] as List<dynamic>);
          _filteredChats = _allChats;
        });
      }
    } catch (_) {
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();

    return Drawer(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 40, 16, 8),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search chats...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.add),
            title: const Text('New Chat'),
            onTap: () {
              Navigator.pop(context);
              widget.onNewChat();
            },
            dense: true,
          ),
          const Divider(),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredChats.isEmpty
                ? const Center(child: Text('No chats found.'))
                : ListView.builder(
              padding: EdgeInsets.zero,
              itemCount: _filteredChats.length,
              itemBuilder: (context, index) {
                final chat = _filteredChats[index];
                final chatId = chat['id'] as int;
                return ListTile(
                  leading: const Icon(Icons.chat_bubble_outline),
                  title: Text(chat['title'] ?? 'Untitled Chat'),
                  onTap: () {
                    Navigator.pop(context);
                    widget.onChatSelected(chatId);
                  },
                  dense: true,
                );
              },
            ),
          ),
          const Divider(),
          ListTile(
            leading: const CircleAvatar(
              radius: 14,
              backgroundImage: NetworkImage('https://api.dicebear.com/7.x/personas/svg?seed=flutter'),
            ),
            title: Text(
              settings.user?.name ?? 'Settings',
              style: Theme.of(context).textTheme.bodyLarge,
              overflow: TextOverflow.ellipsis,
            ),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
            },
          ),
        ],
      ),
    );
  }
}