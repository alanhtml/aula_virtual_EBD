class User {
  final int id;
  final String name;
  final String username;
  final String email;
  final String role;
  final String? fechaNacimiento;
  final String? ci;
  final String? telefono;

  User({
    required this.id,
    required this.name,
    required this.username,
    required this.email,
    required this.role,
    this.fechaNacimiento,
    this.ci,
    this.telefono,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      username: json['username'],
      email: json['email'],
      role: json['role'],
      fechaNacimiento: json['fecha_nacimiento'],
      ci: json['ci'],
      telefono: json['telefono'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'username': username,
      'email': email,
      'role': role,
      'fecha_nacimiento': fechaNacimiento,
      'ci': ci,
      'telefono': telefono,
    };
  }
}
