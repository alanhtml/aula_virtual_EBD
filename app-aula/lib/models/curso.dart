class Curso {
  final int id;
  final String nombre;
  final String? nivel;
  final String? semestre;
  final String? horario;
  final String? descripcion;
  final String? codigo;
  final int? docenteId;
  final String? fechaInicio;
  final String? fechaFin;
  final Pivot? pivot;

  Curso({
    required this.id,
    required this.nombre,
    this.nivel,
    this.semestre,
    this.horario,
    this.descripcion,
    this.codigo,
    this.docenteId,
    this.fechaInicio,
    this.fechaFin,
    this.pivot,
  });

  factory Curso.fromJson(Map<String, dynamic> json) {
    return Curso(
      id: json['id'],
      nombre: json['nombre'],
      nivel: json['nivel'],
      semestre: json['semestre'],
      horario: json['horario'],
      descripcion: json['descripcion'],
      codigo: json['codigo'],
      docenteId: json['docente_id'],
      fechaInicio: json['fecha_inicio'],
      fechaFin: json['fecha_fin'],
      pivot: json['pivot'] != null ? Pivot.fromJson(json['pivot']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nombre': nombre,
      'nivel': nivel,
      'semestre': semestre,
      'horario': horario,
      'descripcion': descripcion,
      'codigo': codigo,
      'docente_id': docenteId,
      'fecha_inicio': fechaInicio,
      'fecha_fin': fechaFin,
      'pivot': pivot?.toJson(),
    };
  }
}

class Pivot {
  final int? notaFinal;
  final int? faltasConsecutivas;
  final int? totalFaltas;
  final String? estado;
  final String? retroalimentacion;

  Pivot({
    this.notaFinal,
    this.faltasConsecutivas,
    this.totalFaltas,
    this.estado,
    this.retroalimentacion,
  });

  factory Pivot.fromJson(Map<String, dynamic> json) {
    return Pivot(
      notaFinal: json['nota_final'],
      faltasConsecutivas: json['faltas_consecutivas'],
      totalFaltas: json['total_faltas'],
      estado: json['estado'],
      retroalimentacion: json['retroalimentacion'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nota_final': notaFinal,
      'faltas_consecutivas': faltasConsecutivas,
      'total_faltas': totalFaltas,
      'estado': estado,
      'retroalimentacion': retroalimentacion,
    };
  }
}
