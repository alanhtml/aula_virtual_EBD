import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/curso.dart';
import '../providers/foro_provider.dart';
import '../providers/user_provider.dart';

class ForoScreen extends StatefulWidget {
  final Curso curso;
  const ForoScreen({super.key, required this.curso});

  @override
  State<ForoScreen> createState() => _ForoScreenState();
}

class _ForoScreenState extends State<ForoScreen> {
  final _mensajeController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
        Provider.of<ForoProvider>(context, listen: false)
            .fetchMensajes(widget.curso.id));
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final foroProvider = Provider.of<ForoProvider>(context);
    final currentUser = Provider.of<UserProvider>(context).user;

    return Scaffold(
      appBar: AppBar(
        title: Text("Foro: ${widget.curso.nombre}"),
      ),
      body: Column(
        children: [
          Expanded(
            child: foroProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: foroProvider.mensajes.length,
                    itemBuilder: (context, index) {
                      final msg = foroProvider.mensajes[index];
                      final isMe = msg.userId == currentUser?.id;
                      return _buildChatBubble(msg, isMe);
                    },
                  ),
          ),
          _buildInputArea(foroProvider),
        ],
      ),
    );
  }

  Widget _buildChatBubble(dynamic msg, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFF4F46E5) : Colors.grey[200],
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(15),
            topRight: const Radius.circular(15),
            bottomLeft: Radius.circular(isMe ? 15 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 15),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isMe)
              Text(
                msg.user?.name ?? "Usuario",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.blueGrey),
              ),
            Text(
              msg.contenido,
              style: TextStyle(color: isMe ? Colors.white : Colors.black87),
            ),
            const SizedBox(height: 4),
            Text(
              DateFormat('HH:mm').format(msg.createdAt),
              style: TextStyle(fontSize: 10, color: isMe ? Colors.white70 : Colors.black45),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea(ForoProvider provider) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _mensajeController,
              decoration: InputDecoration(
                hintText: "Escribe un mensaje...",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(25), borderSide: BorderSide.none),
                filled: true,
                fillColor: Colors.grey[100],
                contentPadding: const EdgeInsets.symmetric(horizontal: 20),
              ),
            ),
          ),
          const SizedBox(width: 8),
          CircleAvatar(
            backgroundColor: const Color(0xFF4F46E5),
            child: IconButton(
              icon: const Icon(Icons.send, color: Colors.white),
              onPressed: () async {
                if (_mensajeController.text.trim().isEmpty) return;
                final success = await provider.enviarMensaje(
                  widget.curso.id,
                  _mensajeController.text.trim(),
                );
                if (success) {
                  _mensajeController.clear();
                  _scrollToBottom();
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
