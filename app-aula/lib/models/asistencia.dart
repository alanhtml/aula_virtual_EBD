class Asistencia {
  final int? id;
  final int userId;
  final int cursoId;
  final String fecha;
  final String estado; // presente, ausente, justificado
  final String? observaciones;

  Asistencia({
    this.id,
    required this.userId,
    required this.cursoId,
    required this.fecha,
    required this.estado,
    this.observaciones,
  });

  factory Asistencia.fromJson(Map<String, dynamic> json) {
    return Asistencia(
      id: json['id'],
      userId: json['user_id'],
      cursoId: json['curso_id'],
      fecha: json['fecha'],
      estado: json['estado'],
      observaciones: json['observaciones'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'curso_id': cursoId,
      'fecha': fecha,
      'estado': estado,
      'observaciones': observaciones,
    };
  }
}
