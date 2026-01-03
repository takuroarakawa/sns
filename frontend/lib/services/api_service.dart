import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/plot.dart';

class ApiService {
  // Default to localhost, but can be configured for production
  final String baseUrl;

  ApiService({this.baseUrl = 'http://localhost:8080'});

  /// Transform paper text into a manga-style plot
  Future<TransformResponse> transformPaper(TransformRequest request) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/transform'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body) as Map<String, dynamic>;
        return TransformResponse.fromJson(jsonData);
      } else {
        throw ApiException(
          'Failed to transform paper: ${response.statusCode}',
          response.statusCode,
        );
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: $e', 0);
    }
  }

  /// Check if the backend is healthy
  Future<bool> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
