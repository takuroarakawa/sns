/// Represents one section of the Ki-Sho-Ten-Ketsu structure
class PlotSection {
  final String title;
  final String content;
  final List<String> highlights;

  PlotSection({
    required this.title,
    required this.content,
    required this.highlights,
  });

  factory PlotSection.fromJson(Map<String, dynamic> json) {
    return PlotSection(
      title: json['title'] as String,
      content: json['content'] as String,
      highlights: (json['highlights'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'highlights': highlights,
    };
  }
}

/// The complete manga plot structure
class MangaPlot {
  final PlotSection ki;   // 起 - Introduction
  final PlotSection sho;  // 承 - Development
  final PlotSection ten;  // 転 - Twist
  final PlotSection ketsu; // 結 - Resolution

  MangaPlot({
    required this.ki,
    required this.sho,
    required this.ten,
    required this.ketsu,
  });

  factory MangaPlot.fromJson(Map<String, dynamic> json) {
    return MangaPlot(
      ki: PlotSection.fromJson(json['ki'] as Map<String, dynamic>),
      sho: PlotSection.fromJson(json['sho'] as Map<String, dynamic>),
      ten: PlotSection.fromJson(json['ten'] as Map<String, dynamic>),
      ketsu: PlotSection.fromJson(json['ketsu'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ki': ki.toJson(),
      'sho': sho.toJson(),
      'ten': ten.toJson(),
      'ketsu': ketsu.toJson(),
    };
  }

  List<PlotSection> get allSections => [ki, sho, ten, ketsu];
}

/// Request model for paper conversion
class ConvertRequest {
  final String paperText;
  final String? title;
  final String? author;

  ConvertRequest({
    required this.paperText,
    this.title,
    this.author,
  });

  Map<String, dynamic> toJson() {
    return {
      'paper_text': paperText,
      if (title != null) 'title': title,
      if (author != null) 'author': author,
    };
  }
}

/// Response model from the API
class ConvertResponse {
  final bool success;
  final MangaPlot? plot;
  final String? error;

  ConvertResponse({
    required this.success,
    this.plot,
    this.error,
  });

  factory ConvertResponse.fromJson(Map<String, dynamic> json) {
    return ConvertResponse(
      success: json['success'] as bool,
      plot: json['plot'] != null
          ? MangaPlot.fromJson(json['plot'] as Map<String, dynamic>)
          : null,
      error: json['error'] as String?,
    );
  }
}
