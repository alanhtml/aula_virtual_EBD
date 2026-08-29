import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/user_provider.dart';
import 'providers/curso_provider.dart';
import 'providers/tarea_provider.dart';
import 'providers/asistencia_provider.dart';
import 'providers/material_provider.dart';
import 'providers/foro_provider.dart';
import 'screens/teacher_dashboard_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => CursoProvider()),
        ChangeNotifierProvider(create: (_) => TareaProvider()),
        ChangeNotifierProvider(create: (_) => AsistenciaProvider()),
        ChangeNotifierProvider(create: (_) => MaterialProvider()),
        ChangeNotifierProvider(create: (_) => ForoProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aula Virtual EBD',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5), // Color institucional Indigo
          brightness: Brightness.light,
        ),
        fontFamily: 'Inter',
      ),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Verificar si hay sesión activa al iniciar
    Future.microtask(() => 
      Provider.of<UserProvider>(context, listen: false).checkAuth()
    );
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    if (userProvider.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (userProvider.isAuthenticated) {
      if (!context.mounted) return const SizedBox.shrink();
      if (userProvider.user?.role == 'docentes') {
        return const TeacherDashboard();
      }
      return const StudentDashboard();
    }

    return const LoginScreen();
  }
}

// Pantalla de Login Simple para pruebas
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final usernameController = TextEditingController();
    final passwordController = TextEditingController();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Aula Virtual",
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: usernameController,
              decoration: const InputDecoration(labelText: "Usuario", border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Contraseña", border: OutlineInputBorder()),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
                onPressed: userProvider.isLoading ? null : () async {
                  final scaffoldMessenger = ScaffoldMessenger.of(context);
                  final result = await userProvider.login(
                    usernameController.text, 
                    passwordController.text
                  );
                  if (!result['success']) {
                    scaffoldMessenger.showSnackBar(
                      SnackBar(content: Text(result['message']))
                    );
                  }
                },
                child: userProvider.isLoading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Entrar", style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}


