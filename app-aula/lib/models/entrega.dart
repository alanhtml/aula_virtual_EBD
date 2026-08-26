import 'user.dart';

class Entrega {
  final int? id;
  final int tareaId;
  final int userId;
  final String? comentarioEstudiante;
  final String? archivoUrl;
  final double? calificacion;
  final String? comentarioProfesor;
  final String? fechaEntrega;
  final User? user;

  Entrega({
    this.id,
    required this.tareaId,
    required this.userId,
    this.comentarioEstudiante,
    this.archivoUrl,
    this.calificacion,
    this.comentarioProfesor,
    this.fechaEntrega,
    this.user,
  });

  factory Entrega.fromJson(Map<String, dynamic> json) {
    return Entrega(
      id: json['id'],
      tareaId: json['tarea_id'],
      userId: json['user_id'],
      comentarioEstudiante: json['comentario_estudiante'],
      archivoUrl: json['archivo_url'],
      calificacion: json['calificacion'] != null ? double.parse(json['calificacion'].toString()) : null,
      comentarioProfesor: json['comentario_profesor'],
      fechaEntrega: json['fecha_entrega'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'tarea_id': tareaId,
      'user_id': userId,
      'comentario_estudiante': comentarioEstudiante,
      'archivo_url': archivoUrl,
      'calificacion': calificacion,
      'comentario_profesor': comentarioProfesor,
      'fecha_entrega': fechaEntrega,
    };
  }
}
