use serde::{Deserialize, Serialize};

/// Request model for paper conversion
#[derive(Debug, Deserialize)]
pub struct ConvertRequest {
    pub paper_text: String,
    pub title: Option<String>,
    pub author: Option<String>,
}

/// Represents one section of the Ki-Sho-Ten-Ketsu structure
#[derive(Debug, Serialize, Clone)]
pub struct PlotSection {
    pub title: String,
    pub content: String,
    pub highlights: Vec<String>,
}

/// The complete manga plot structure
#[derive(Debug, Serialize)]
pub struct MangaPlot {
    pub ki: PlotSection,   // 起 - Introduction
    pub sho: PlotSection,  // 承 - Development
    pub ten: PlotSection,  // 転 - Twist
    pub ketsu: PlotSection, // 結 - Resolution
}

/// Response model for the conversion endpoint
#[derive(Debug, Serialize)]
pub struct ConvertResponse {
    pub success: bool,
    pub plot: Option<MangaPlot>,
    pub error: Option<String>,
}

impl ConvertResponse {
    pub fn success(plot: MangaPlot) -> Self {
        Self {
            success: true,
            plot: Some(plot),
            error: None,
        }
    }

    pub fn error(message: String) -> Self {
        Self {
            success: false,
            plot: None,
            error: Some(message),
        }
    }
}
