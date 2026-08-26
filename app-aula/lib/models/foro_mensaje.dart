import 'user.dart';

class ForoMensaje {
  final int id;
  final String contenido;
  final int cursoId;
  final int? foroId;
  final int userId;
  final DateTime createdAt;
  final User? user;

  ForoMensaje({
    required this.id,
    required this.contenido,
    required this.cursoId,
    this.foroId,
    required this.userId,
    required this.createdAt,
    this.user,
  });

  factory ForoMensaje.fromJson(Map<String, dynamic> json) {
    return ForoMensaje(
      id: json['id'],
      contenido: json['contenido'],
      cursoId: json['curso_id'],
      foroId: json['foro_id'],
      userId: json['user_id'],
      createdAt: DateTime.parse(json['created_at']),
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'contenido': contenido,
      'curso_id': cursoId,
      'foro_id': foroId,
    };
  }
}
