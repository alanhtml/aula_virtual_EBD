import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/curso.dart';
import '../models/material.dart';
import '../providers/material_provider.dart';
import '../providers/user_provider.dart';

class MaterialesScreen extends StatefulWidget {
  final Curso curso;
  const MaterialesScreen({super.key, required this.curso});

  @override
  State<MaterialesScreen> createState() => _MaterialesScreenState();
}

class _MaterialesScreenState extends State<MaterialesScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
        Provider.of<MaterialProvider>(context, listen: false)
            .fetchMateriales(widget.curso.id));
  }

  @override
  Widget build(BuildContext context) {
    final materialProvider = Provider.of<MaterialProvider>(context);
    final isTeacher = Provider.of<UserProvider>(context).user?.role == 'docentes';

    return Scaffold(
      appBar: AppBar(
        title: Text("Material: ${widget.curso.nombre}"),
        actions: [
          if (isTeacher)
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => _showAddMaterialDialog(context),
            ),
        ],
      ),
      body: materialProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : materialProvider.materiales.isEmpty
              ? const Center(child: Text("No hay materiales disponibles."))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: materialProvider.materiales.length,
                  itemBuilder: (context, index) {
                    final material = materialProvider.materiales[index];
                    return _buildMaterialCard(material, isTeacher);
                  },
                ),
    );
  }

  Widget _buildMaterialCard(MaterialAcademico material, bool isTeacher) {
    IconData icon;
    Color color;

    switch (material.tipo) {
      case 'pdf':
        icon = Icons.picture_as_pdf;
        color = Colors.red;
        break;
      case 'video':
        icon = Icons.play_circle_fill;
        color = Colors.blue;
        break;
      case 'enlace':
        icon = Icons.link;
        color = Colors.green;
        break;
      default:
        icon = Icons.insert_drive_file;
        color = Colors.grey;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: color, size: 40),
        title: Text(material.titulo, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(material.descripcion ?? "Sin descripción"),
        trailing: isTeacher
            ? IconButton(
                icon: const Icon(Icons.delete, color: Colors.redAccent),
                onPressed: () => _confirmDelete(material),
              )
            : const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () => _launchURL(material.url),
      ),
    );
  }

  Future<void> _launchURL(String url) async {
    // Si la URL es relativa de Laravel, anteponer base URL
    String finalUrl = url;
    if (url.startsWith('/storage')) {
        finalUrl = "https://aula-virtual-ebd.onrender.com$url";
    }
    
    final Uri uri = Uri.parse(finalUrl);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("No se pudo abrir el enlace")),
        );
      }
    }
  }

  void _confirmDelete(MaterialAcademico material) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Eliminar Material"),
        content: const Text("¿Estás seguro de que deseas eliminar este material?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await Provider.of<MaterialProvider>(context, listen: false)
                  .eliminarMaterial(material.id, widget.curso.id);
            },
            child: const Text("Eliminar", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showAddMaterialDialog(BuildContext context) {
    final tituloController = TextEditingController();
    final descController = TextEditingController();
    final urlController = TextEditingController();
    String tipo = 'enlace';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text("Agregar Material"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: tituloController, decoration: const InputDecoration(labelText: "Título")),
                TextField(controller: descController, decoration: const InputDecoration(labelText: "Descripción")),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: tipo,
                  items: ['enlace', 'video'].map((t) => DropdownMenuItem(value: t, child: Text(t.toUpperCase()))).toList(),
                  onChanged: (val) => setState(() => tipo = val!),
                  decoration: const InputDecoration(labelText: "Tipo"),
                ),
                TextField(controller: urlController, decoration: const InputDecoration(labelText: "URL (YouTube, Drive, etc.)")),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancelar")),
            ElevatedButton(
              onPressed: () async {
                if (tituloController.text.isEmpty || urlController.text.isEmpty) return;
                
                final success = await Provider.of<MaterialProvider>(context, listen: false)
                    .crearMaterial(
                  titulo: tituloController.text,
                  descripcion: descController.text,
                  tipo: tipo,
                  cursoId: widget.curso.id,
                  url: urlController.text,
                );

                if (mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(success ? "Material agregado" : "Error al agregar")),
                  );
                }
              },
              child: const Text("Guardar"),
            ),
          ],
        ),
      ),
    );
  }
}
