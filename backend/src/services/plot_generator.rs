use crate::models::PlotStructure;
use super::text_analyzer::AnalyzedPaper;

/// Generates manga-style plots from analyzed academic papers
pub struct PlotGenerator;

impl PlotGenerator {
    pub fn new() -> Self {
        PlotGenerator
    }

    /// Transforms analyzed paper into kishōtenketsu plot structure
    pub fn generate_plot(&self, analyzed: &AnalyzedPaper) -> PlotStructure {
        PlotStructure {
            ki: self.generate_ki(analyzed),
            sho: self.generate_sho(analyzed),
            ten: self.generate_ten(analyzed),
            ketsu: self.generate_ketsu(analyzed),
        }
    }

    /// Ki (起) - Introduction: Sets up the dramatic scene
    fn generate_ki(&self, analyzed: &AnalyzedPaper) -> String {
        let templates = vec![
            format!(
                "🌟 In the halls of academia, a brilliant mind pondered a profound question: {}. \
                The stage was set for an epic quest for truth!",
                self.dramatize_question(&analyzed.research_question)
            ),
            format!(
                "⚡ The world faced an unsolved mystery: {}. \
                Our hero, armed with curiosity and determination, stepped forward to unravel it!",
                self.dramatize_question(&analyzed.research_question)
            ),
            format!(
                "🔥 A challenge emerged from the depths of human knowledge: {}. \
                The journey to discover the truth was about to begin!",
                self.dramatize_question(&analyzed.research_question)
            ),
        ];

        // Select template based on text characteristics
        let index = analyzed.research_question.len() % templates.len();
        templates[index].clone()
    }

    /// Sho (承) - Development: Builds tension through the research process
    fn generate_sho(&self, analyzed: &AnalyzedPaper) -> String {
        let templates = vec![
            format!(
                "💪 The path was treacherous, but our researcher pressed on! {}. \
                Each experiment brought new challenges, each data point a step closer to the truth. \
                The tension mounted as patterns began to emerge from the chaos!",
                self.dramatize_methodology(&analyzed.methodology)
            ),
            format!(
                "🎯 With unwavering focus, the investigation began: {}. \
                Obstacles appeared at every turn, but determination turned challenges into opportunities. \
                The breakthrough was near—could it be reached?!",
                self.dramatize_methodology(&analyzed.methodology)
            ),
            format!(
                "⚔️ The battle for knowledge intensified! {}. \
                Days turned into nights as the research deepened. \
                Something extraordinary was waiting to be discovered!",
                self.dramatize_methodology(&analyzed.methodology)
            ),
        ];

        let index = analyzed.methodology.len() % templates.len();
        templates[index].clone()
    }

    /// Ten (転) - Twist: The dramatic revelation
    fn generate_ten(&self, analyzed: &AnalyzedPaper) -> String {
        let templates = vec![
            format!(
                "💥 BREAKTHROUGH! The moment of truth arrived! {}! \
                Everything clicked into place—this discovery would change everything! \
                The implications were staggering, defying all expectations!",
                self.dramatize_findings(&analyzed.key_findings)
            ),
            format!(
                "✨ In a flash of insight, the truth revealed itself: {}! \
                The puzzle pieces aligned in ways no one predicted! \
                This was more than a finding—it was a revolution in understanding!",
                self.dramatize_findings(&analyzed.key_findings)
            ),
            format!(
                "🌪️ The turning point crashed through like thunder: {}! \
                Reality bent to reveal its secrets! \
                The conventional wisdom shattered before this revelation!",
                self.dramatize_findings(&analyzed.key_findings)
            ),
        ];

        let index = analyzed.key_findings.len() % templates.len();
        templates[index].clone()
    }

    /// Ketsu (結) - Conclusion: The triumphant resolution
    fn generate_ketsu(&self, analyzed: &AnalyzedPaper) -> String {
        let templates = vec![
            format!(
                "🏆 Victory! The quest was complete! {}. \
                The academic world would never be the same. \
                This triumph opened doors to infinite possibilities, lighting the way for future heroes! \
                The legend had just begun! 🌅",
                self.dramatize_implications(&analyzed.implications)
            ),
            format!(
                "🎊 The journey reached its glorious conclusion: {}. \
                What started as a question became a beacon of knowledge! \
                Future generations would build upon this foundation. \
                The story continues, but this chapter—victorious! ⭐",
                self.dramatize_implications(&analyzed.implications)
            ),
            format!(
                "👑 From uncertainty to clarity, the transformation was complete! {}. \
                The world gained new wisdom, new perspective, new hope! \
                This was not an ending—it was a spectacular new beginning! 🚀",
                self.dramatize_implications(&analyzed.implications)
            ),
        ];

        let index = analyzed.implications.len() % templates.len();
        templates[index].clone()
    }

    /// Adds dramatic flair to the research question
    fn dramatize_question(&self, text: &str) -> String {
        text.replace("?", "?!")
            .replace(" is ", " truly is ")
            .replace(" can ", " could possibly ")
            .replace(" does ", " actually does ")
    }

    /// Adds dramatic flair to methodology
    fn dramatize_methodology(&self, text: &str) -> String {
        text.replace("using ", "wielding the power of ")
            .replace("analysis", "deep analytical investigation")
            .replace("experiment", "daring experiment")
            .replace("study", "intensive study")
    }

    /// Adds dramatic flair to findings
    fn dramatize_findings(&self, text: &str) -> String {
        text.replace("found", "discovered")
            .replace("showed", "revealed")
            .replace("significant", "tremendously significant")
            .replace("correlation", "powerful correlation")
            .replace("effect", "profound effect")
    }

    /// Adds dramatic flair to implications
    fn dramatize_implications(&self, text: &str) -> String {
        text.replace("suggests", "powerfully suggests")
            .replace("important", "critically important")
            .replace("future", "brilliant future")
            .replace("impact", "transformative impact")
            .replace("understanding", "revolutionary understanding")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plot_generator() {
        let generator = PlotGenerator::new();
        let analyzed = AnalyzedPaper {
            research_question: "What causes climate change?".to_string(),
            methodology: "Statistical analysis of data".to_string(),
            key_findings: "We found significant correlations".to_string(),
            implications: "This suggests important climate impacts".to_string(),
            abstract_text: "Study of climate".to_string(),
        };

        let plot = generator.generate_plot(&analyzed);
        assert!(plot.ki.contains("🌟") || plot.ki.contains("⚡") || plot.ki.contains("🔥"));
        assert!(!plot.sho.is_empty());
        assert!(!plot.ten.is_empty());
        assert!(!plot.ketsu.is_empty());
    }
}
