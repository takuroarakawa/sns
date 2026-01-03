use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct TransformRequest {
    pub paper_text: String,
    #[serde(default)]
    pub author_name: Option<String>,
}
