use regex::Regex;

/// Analyzes academic paper text to extract key components
pub struct TextAnalyzer;

#[derive(Debug)]
pub struct AnalyzedPaper {
    pub research_question: String,
    pub methodology: String,
    pub key_findings: String,
    pub implications: String,
    pub abstract_text: String,
}

impl TextAnalyzer {
    pub fn new() -> Self {
        TextAnalyzer
    }

    /// Analyzes the paper text and extracts key components
    pub fn analyze(&self, text: &str) -> AnalyzedPaper {
        let abstract_text = self.extract_abstract(text);
        let research_question = self.extract_research_question(text);
        let methodology = self.extract_methodology(text);
        let key_findings = self.extract_findings(text);
        let implications = self.extract_implications(text);

        AnalyzedPaper {
            research_question,
            methodology,
            key_findings,
            implications,
            abstract_text,
        }
    }

    /// Extracts the abstract from the paper
    fn extract_abstract(&self, text: &str) -> String {
        // Look for abstract section
        let abstract_regex = Regex::new(r"(?i)abstract[:\s]+(.*?)(?:introduction|keywords|$)")
            .unwrap();
        
        if let Some(caps) = abstract_regex.captures(text) {
            if let Some(abstract_match) = caps.get(1) {
                return self.clean_text(abstract_match.as_str());
            }
        }

        // If no abstract found, use first few sentences
        let sentences: Vec<&str> = text.split('.').take(3).collect();
        self.clean_text(&sentences.join(". "))
    }

    /// Extracts the research question or problem statement
    fn extract_research_question(&self, text: &str) -> String {
        // Look for common research question patterns
        let patterns = vec![
            r"(?i)research question[:\s]+(.*?)[\.\n]",
            r"(?i)problem statement[:\s]+(.*?)[\.\n]",
            r"(?i)we investigate[:\s]+(.*?)[\.\n]",
            r"(?i)this study examines[:\s]+(.*?)[\.\n]",
            r"(?i)the purpose of this study[:\s]+(.*?)[\.\n]",
        ];

        for pattern in patterns {
            let regex = Regex::new(pattern).unwrap();
            if let Some(caps) = regex.captures(text) {
                if let Some(question_match) = caps.get(1) {
                    return self.clean_text(question_match.as_str());
                }
            }
        }

        // Fallback: look for question marks in the text
        let lines: Vec<&str> = text.lines().collect();
        for line in lines {
            if line.contains('?') && line.len() > 20 && line.len() < 200 {
                return self.clean_text(line);
            }
        }

        "Exploring uncharted territories of knowledge".to_string()
    }

    /// Extracts methodology information
    fn extract_methodology(&self, text: &str) -> String {
        let method_regex = Regex::new(
            r"(?i)(methodology|method|approach|experimental design)[:\s]+(.*?)(?:results|findings|discussion|conclusion|$)"
        ).unwrap();

        if let Some(caps) = method_regex.captures(text) {
            if let Some(method_match) = caps.get(2) {
                let method_text = method_match.as_str();
                // Take first few sentences
                let sentences: Vec<&str> = method_text.split('.').take(2).collect();
                return self.clean_text(&sentences.join(". "));
            }
        }

        "Through rigorous experimentation and careful observation".to_string()
    }

    /// Extracts key findings
    fn extract_findings(&self, text: &str) -> String {
        let findings_patterns = vec![
            r"(?i)(results|findings|discovered|found that)[:\s]+(.*?)(?:discussion|conclusion|implications|$)",
            r"(?i)our results show[:\s]+(.*?)[\.\n]",
            r"(?i)we found that[:\s]+(.*?)[\.\n]",
        ];

        for pattern in findings_patterns {
            let regex = Regex::new(pattern).unwrap();
            if let Some(caps) = regex.captures(text) {
                if let Some(finding_match) = caps.get(2) {
                    let finding_text = finding_match.as_str();
                    let sentences: Vec<&str> = finding_text.split('.').take(2).collect();
                    return self.clean_text(&sentences.join(". "));
                }
            }
        }

        "Groundbreaking discoveries that challenge conventional wisdom".to_string()
    }

    /// Extracts implications and conclusions
    fn extract_implications(&self, text: &str) -> String {
        let implications_regex = Regex::new(
            r"(?i)(conclusion|implications|significance|impact)[:\s]+(.*?)(?:references|acknowledgments|$)"
        ).unwrap();

        if let Some(caps) = implications_regex.captures(text) {
            if let Some(impl_match) = caps.get(2) {
                let impl_text = impl_match.as_str();
                let sentences: Vec<&str> = impl_text.split('.').take(2).collect();
                return self.clean_text(&sentences.join(". "));
            }
        }

        "These findings will reshape our understanding and open new horizons".to_string()
    }

    /// Cleans and normalizes text
    fn clean_text(&self, text: &str) -> String {
        // Remove extra whitespace
        let text = text.trim();
        let text = Regex::new(r"\s+").unwrap().replace_all(text, " ");
        
        // Remove common artifacts
        let text = text.replace('\n', " ");
        let text = text.replace('\r', "");
        
        // Limit length
        if text.len() > 500 {
            format!("{}...", &text[..497])
        } else {
            text.to_string()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_text_analyzer() {
        let analyzer = TextAnalyzer::new();
        let sample_text = "Abstract: This study investigates the effects of climate change. \
                          Method: We used statistical analysis. \
                          Results: We found significant correlations. \
                          Conclusion: Climate change has measurable impacts.";
        
        let result = analyzer.analyze(sample_text);
        assert!(!result.abstract_text.is_empty());
        assert!(!result.research_question.is_empty());
    }
}
