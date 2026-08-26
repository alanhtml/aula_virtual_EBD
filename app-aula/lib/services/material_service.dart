import 'dart:io';
import 'package:dio/dio.dart';
import '../models/material.dart';
import 'dio_client.dart';

class MaterialService {
  final _dio = DioClient().dio;

  Future<List<MaterialAcademico>> getMateriales(int cursoId) async {
    try {
      final response = await _dio.get('/materiales', queryParameters: {'curso_id': cursoId});
      if (response.statusCode == 200) {
        List<dynamic> data = response.data;
        return data.map((json) => MaterialAcademico.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> uploadMaterial({
    required String titulo,
    String? descripcion,
    required String tipo,
    required int cursoId,
    File? archivo,
    String? url,
  }) async {
    try {
      FormData formData = FormData.fromMap({
        'titulo': titulo,
        'descripcion': descripcion,
        'tipo': tipo,
        'curso_id': cursoId,
      });

      if (archivo != null) {
        formData.files.add(MapEntry(
          'archivo',
          await MultipartFile.fromFile(archivo.path, filename: archivo.path.split('/').last),
        ));
      } else if (url != null) {
        formData.fields.add(MapEntry('url', url));
      }

      final response = await _dio.post('/materiales', data: formData);
      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteMaterial(int id) async {
    try {
      final response = await _dio.delete('/materiales/$id');
      return response.statusCode == 204;
    } catch (e) {
      return false;
    }
  }
}
