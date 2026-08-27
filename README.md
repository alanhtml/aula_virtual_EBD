# Aula Virtual EBD

Sistema de Aula Virtual desarrollado con Flutter para la gestión educativa. Esta aplicación permite a docentes y estudiantes interactuar en un entorno digital, gestionando cursos, tareas, asistencia y materiales de estudio.

## 🚀 Características Principales

- **Gestión de Usuarios:** Autenticación y perfiles diferenciados para Docentes y Estudiantes.
- **Dashboard del Docente:** Herramientas para administrar cursos y actividades.
- **Control de Asistencia:** Registro y seguimiento de asistencia de alumnos.
- **Gestión de Tareas:** Creación, entrega y calificación de actividades académicas.
- **Foro de Discusión:** Espacio para la interacción y resolución de dudas.
- **Material de Apoyo:** Repositorio de recursos y documentos para las clases.

## 🛠️ Tecnologías y Librerías Utilizadas

El proyecto utiliza las siguientes dependencias clave:

- **[Flutter](https://flutter.dev/):** Framework principal para el desarrollo multiplataforma.
- **[Provider](https://pub.dev/packages/provider):** Gestión de estado simple y eficiente.
- **[Dio](https://pub.dev/packages/dio):** Cliente HTTP potente para peticiones a la API.
- **[Shared Preferences](https://pub.dev/packages/shared_preferences):** Almacenamiento local persistente para datos de sesión.
- **[Intl](https://pub.dev/packages/intl):** Formateo de fechas y localización.
- **[URL Launcher](https://pub.dev/packages/url_launcher):** Apertura de enlaces externos.
- **[File Picker](https://pub.dev/packages/file_picker):** Selección de archivos desde el dispositivo.

## 📂 Estructura del Proyecto

```text
lib/
├── main.dart             # Punto de entrada y configuración de Providers
├── providers/            # Lógica de negocio y gestión de estado
│   ├── user_provider.dart
│   ├── curso_provider.dart
│   ├── tarea_provider.dart
│   └── ...
├── screens/              # Pantallas de la interfaz de usuario
│   ├── teacher_dashboard_screen.dart
│   └── ...
└── models/               # Modelos de datos (opcional según arquitectura)
```

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Obtener dependencias:**
   ```bash
   flutter pub get
   ```

3. **Ejecutar la aplicación:**
   ```bash
   flutter run
   ```

## 🎨 Diseño
- **Estilo:** Material 3
- **Fuente:** Inter
- **Color Institucional:** Indigo (#4F46E5)

---
Desarrollado para el 8vo Semestre - UNIFRANZ.
