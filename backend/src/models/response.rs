use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct PlotStructure {
    pub ki: String,       // 起 - Introduction
    pub sho: String,      // 承 - Development
    pub ten: String,      // 転 - Twist
    pub ketsu: String,    // 結 - Conclusion
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TransformResponse {
    pub success: bool,
    pub plot: PlotStructure,
    pub original_abstract: String,
    pub processing_time_ms: u64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub error: String,
}
