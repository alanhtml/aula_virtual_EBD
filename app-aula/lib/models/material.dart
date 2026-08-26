class MaterialAcademico {
  final int id;
  final String titulo;
  final String? descripcion;
  final String tipo; // pdf, video, enlace, imagen, otro
  final String url;
  final int cursoId;
  final int? seccionId;

  MaterialAcademico({
    required this.id,
    required this.titulo,
    this.descripcion,
    required this.tipo,
    required this.url,
    required this.cursoId,
    this.seccionId,
  });

  factory MaterialAcademico.fromJson(Map<String, dynamic> json) {
    return MaterialAcademico(
      id: json['id'],
      titulo: json['titulo'],
      descripcion: json['descripcion'],
      tipo: json['tipo'],
      url: json['url'],
      cursoId: json['curso_id'],
      seccionId: json['seccion_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'titulo': titulo,
      'descripcion': descripcion,
      'tipo': tipo,
      'url': url,
      'curso_id': cursoId,
      'seccion_id': seccionId,
    };
  }
}
