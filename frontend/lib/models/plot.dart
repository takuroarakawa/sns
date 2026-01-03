/// Plot structure using kishōtenketsu format
class PlotStructure {
  final String ki;     // 起 - Introduction
  final String sho;    // 承 - Development
  final String ten;    // 転 - Twist
  final String ketsu;  // 結 - Conclusion

  PlotStructure({
    required this.ki,
    required this.sho,
    required this.ten,
    required this.ketsu,
  });

  factory PlotStructure.fromJson(Map<String, dynamic> json) {
    return PlotStructure(
      ki: json['ki'] as String,
      sho: json['sho'] as String,
      ten: json['ten'] as String,
      ketsu: json['ketsu'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ki': ki,
      'sho': sho,
      'ten': ten,
      'ketsu': ketsu,
    };
  }
}

/// Response from the transform API
class TransformResponse {
  final bool success;
  final PlotStructure plot;
  final String originalAbstract;
  final int processingTimeMs;

  TransformResponse({
    required this.success,
    required this.plot,
    required this.originalAbstract,
    required this.processingTimeMs,
  });

  factory TransformResponse.fromJson(Map<String, dynamic> json) {
    return TransformResponse(
      success: json['success'] as bool,
      plot: PlotStructure.fromJson(json['plot'] as Map<String, dynamic>),
      originalAbstract: json['original_abstract'] as String,
      processingTimeMs: json['processing_time_ms'] as int,
    );
  }
}

/// Request to transform paper
class TransformRequest {
  final String paperText;
  final String? authorName;

  TransformRequest({
    required this.paperText,
    this.authorName,
  });

  Map<String, dynamic> toJson() {
    return {
      'paper_text': paperText,
      if (authorName != null) 'author_name': authorName,
    };
  }
}
