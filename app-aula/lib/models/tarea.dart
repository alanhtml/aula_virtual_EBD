class Tarea {
  final int id;
  final String titulo;
  final String? contenido;
  final String? fechaEntrega;
  final int? puntos;
  final int cursoId;
  final int? seccionId;

  Tarea({
    required this.id,
    required this.titulo,
    this.contenido,
    this.fechaEntrega,
    this.puntos,
    required this.cursoId,
    this.seccionId,
  });

  factory Tarea.fromJson(Map<String, dynamic> json) {
    return Tarea(
      id: json['id'],
      titulo: json['titulo'],
      contenido: json['contenido'],
      fechaEntrega: json['fecha_entrega'],
      puntos: json['puntos'],
      cursoId: json['curso_id'],
      seccionId: json['seccion_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'titulo': titulo,
      'contenido': contenido,
      'fecha_entrega': fechaEntrega,
      'puntos': puntos,
      'curso_id': cursoId,
      'seccion_id': seccionId,
    };
  }
}
