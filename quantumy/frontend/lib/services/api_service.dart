import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/plot_models.dart';

class ApiService {
  final String baseUrl;

  ApiService({this.baseUrl = 'http://localhost:3000'});

  /// Converts an academic paper to a manga plot
  Future<ConvertResponse> convertPaper({
    required String paperText,
    String? title,
    String? author,
  }) async {
    try {
      final request = ConvertRequest(
        paperText: paperText,
        title: title,
        author: author,
      );

      final response = await http.post(
        Uri.parse('$baseUrl/api/convert'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body) as Map<String, dynamic>;
        return ConvertResponse.fromJson(jsonResponse);
      } else if (response.statusCode == 400) {
        final jsonResponse = jsonDecode(response.body) as Map<String, dynamic>;
        return ConvertResponse.fromJson(jsonResponse);
      } else {
        return ConvertResponse(
          success: false,
          error: 'Server error: ${response.statusCode}',
        );
      }
    } catch (e) {
      return ConvertResponse(
        success: false,
        error: 'Failed to connect to server: $e',
      );
    }
  }

  /// Checks if the backend server is running
  Future<bool> healthCheck() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
      ).timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
