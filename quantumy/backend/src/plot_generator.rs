use crate::models::{MangaPlot, PlotSection};

/// Core logic for converting academic papers into manga-style plots
pub struct PlotGenerator;

impl PlotGenerator {
    /// Converts academic paper text into a Ki-Sho-Ten-Ketsu manga plot
    pub fn convert_to_manga_plot(
        paper_text: &str,
        title: Option<&str>,
        _author: Option<&str>,
    ) -> Result<MangaPlot, String> {
        if paper_text.trim().is_empty() {
            return Err("Paper text cannot be empty".to_string());
        }

        // Analyze the paper structure
        let analysis = Self::analyze_paper(paper_text);

        // Generate each section of the plot
        let ki = Self::generate_ki(&analysis, title);
        let sho = Self::generate_sho(&analysis);
        let ten = Self::generate_ten(&analysis);
        let ketsu = Self::generate_ketsu(&analysis);

        Ok(MangaPlot {
            ki,
            sho,
            ten,
            ketsu,
        })
    }

    /// Analyzes the paper to extract key elements
    fn analyze_paper(text: &str) -> PaperAnalysis {
        let word_count = text.split_whitespace().count();
        let sentences: Vec<&str> = text.split('.').collect();
        let sentence_count = sentences.len();

        // Extract key themes (simplified - looks for repeated important words)
        let key_themes = Self::extract_key_themes(text);

        // Identify problem statement (usually in first 30% of paper)
        let intro_text = Self::get_section_text(text, 0.0, 0.3);
        let problem = Self::extract_problem(intro_text);

        // Identify methodology (middle section)
        let method_text = Self::get_section_text(text, 0.3, 0.6);
        let methods = Self::extract_methods(method_text);

        // Identify challenges (look for keywords)
        let challenges = Self::extract_challenges(text);

        // Identify results and conclusions (last 30%)
        let conclusion_text = Self::get_section_text(text, 0.7, 1.0);
        let results = Self::extract_results(conclusion_text);

        PaperAnalysis {
            word_count,
            sentence_count,
            key_themes,
            problem,
            methods,
            challenges,
            results,
        }
    }

    /// 起 (Ki) - Introduction: Sets the scene and introduces the challenge
    fn generate_ki(analysis: &PaperAnalysis, title: Option<&str>) -> PlotSection {
        let title_text = title.unwrap_or("this research");
        
        let content = format!(
            "🎬 Scene 1: The Challenge Emerges\n\n\
            In the world of science, a formidable challenge awaits! {}\n\n\
            Our brilliant protagonist (the researcher) discovers a mysterious problem: {}\n\n\
            The stakes are high, and the scientific community holds its breath. \
            Can this challenge be overcome?",
            title_text,
            analysis.problem
        );

        let highlights = vec![
            format!("Challenge: {}", analysis.problem),
            format!("Key themes: {}", analysis.key_themes.join(", ")),
            "The adventure begins!".to_string(),
        ];

        PlotSection {
            title: "起 (Ki) - The Challenge Emerges".to_string(),
            content,
            highlights,
        }
    }

    /// 承 (Sho) - Development: The journey and preparation
    fn generate_sho(analysis: &PaperAnalysis) -> PlotSection {
        let methods_text = if !analysis.methods.is_empty() {
            analysis.methods.join(", ")
        } else {
            "innovative techniques and careful analysis".to_string()
        };

        let content = format!(
            "💪 Scene 2: Training and Preparation\n\n\
            Our hero doesn't give up! Armed with determination and scientific rigor, \
            they begin their quest.\n\n\
            Training montage begins:\n\
            - Gathering powerful tools: {}\n\
            - Studying ancient texts (previous research)\n\
            - Preparing for the battles ahead\n\n\
            The methodology is set. The research design is perfected. \
            Now it's time to face the challenge head-on!",
            methods_text
        );

        let highlights = vec![
            format!("Research methods: {}", methods_text),
            format!("Analyzed {} aspects", analysis.sentence_count / 10),
            "Preparation complete!".to_string(),
        ];

        PlotSection {
            title: "承 (Sho) - The Journey Begins".to_string(),
            content,
            highlights,
        }
    }

    /// 転 (Ten) - Twist: Unexpected challenges and breakthroughs
    fn generate_ten(analysis: &PaperAnalysis) -> PlotSection {
        let challenges_text = if !analysis.challenges.is_empty() {
            analysis.challenges.join(" and ")
        } else {
            "unexpected obstacles in the data and methodology".to_string()
        };

        let content = format!(
            "⚡ Scene 3: The Unexpected Twist!\n\n\
            Just when everything seemed to be going according to plan...\n\n\
            PLOT TWIST! {}\n\n\
            The situation looks dire. Will our hero overcome these obstacles? \
            The tension rises to its peak!\n\n\
            But wait... in the darkest moment, a glimmer of hope appears. \
            A breakthrough! An unexpected insight that changes everything!",
            challenges_text
        );

        let highlights = vec![
            format!("Challenge encountered: {}", challenges_text),
            "Crisis point reached".to_string(),
            "Breakthrough achieved!".to_string(),
        ];

        PlotSection {
            title: "転 (Ten) - The Dramatic Twist".to_string(),
            content,
            highlights,
        }
    }

    /// 結 (Ketsu) - Resolution: Victory and conclusions
    fn generate_ketsu(analysis: &PaperAnalysis) -> PlotSection {
        let results_text = if !analysis.results.is_empty() {
            analysis.results.join(", ")
        } else {
            "significant findings that advance our understanding".to_string()
        };

        let content = format!(
            "🎉 Scene 4: Victory and Resolution\n\n\
            Through perseverance, brilliant thinking, and rigorous methodology, \
            our hero emerges victorious!\n\n\
            The results are in: {}\n\n\
            The scientific community celebrates! The research has opened new doors, \
            answered important questions, and paved the way for future adventures.\n\n\
            This isn't the end—it's just the beginning of a new chapter in science! \
            The legacy of this research will inspire countless others to take up \
            the torch and continue the quest for knowledge.\n\n\
            THE END... OR IS IT JUST THE BEGINNING?",
            results_text
        );

        let highlights = vec![
            format!("Key findings: {}", results_text),
            format!("Impact: Advanced understanding of {}", analysis.key_themes.join(" and ")),
            "Mission accomplished! 🏆".to_string(),
        ];

        PlotSection {
            title: "結 (Ketsu) - Triumphant Resolution".to_string(),
            content,
            highlights,
        }
    }

    // Helper methods for analysis

    fn get_section_text(text: &str, start_ratio: f32, end_ratio: f32) -> &str {
        let len = text.len();
        let start = (len as f32 * start_ratio) as usize;
        let end = (len as f32 * end_ratio) as usize;
        &text[start.min(len)..end.min(len)]
    }

    fn extract_key_themes(text: &str) -> Vec<String> {
        // Simple keyword extraction - look for capitalized words and frequent terms
        let words: Vec<&str> = text.split_whitespace().collect();
        let mut themes = Vec::new();

        // Common academic keywords
        let keywords = ["research", "study", "analysis", "method", "result", "conclusion",
                       "data", "experiment", "theory", "model", "system", "approach"];

        for keyword in keywords {
            if text.to_lowercase().contains(keyword) {
                themes.push(keyword.to_string());
                if themes.len() >= 3 {
                    break;
                }
            }
        }

        if themes.is_empty() {
            themes.push("scientific inquiry".to_string());
        }

        themes
    }

    fn extract_problem(text: &str) -> String {
        let problem_keywords = ["problem", "challenge", "question", "issue", "gap", "lack"];
        
        for keyword in problem_keywords {
            if let Some(pos) = text.to_lowercase().find(keyword) {
                let start = pos.saturating_sub(50);
                let end = (pos + 100).min(text.len());
                return text[start..end].trim().to_string();
            }
        }

        "a complex scientific challenge requiring innovative solutions".to_string()
    }

    fn extract_methods(text: &str) -> Vec<String> {
        let method_keywords = ["method", "approach", "technique", "procedure", "analysis",
                               "experiment", "study", "investigation"];
        
        let mut methods = Vec::new();
        for keyword in method_keywords {
            if text.to_lowercase().contains(keyword) {
                methods.push(format!("advanced {}", keyword));
                if methods.len() >= 2 {
                    break;
                }
            }
        }

        if methods.is_empty() {
            methods.push("rigorous scientific methodology".to_string());
        }

        methods
    }

    fn extract_challenges(text: &str) -> Vec<String> {
        let challenge_keywords = ["limitation", "difficult", "challenge", "problem",
                                 "obstacle", "constraint", "complex"];
        
        let mut challenges = Vec::new();
        for keyword in challenge_keywords {
            if text.to_lowercase().contains(keyword) {
                challenges.push(format!("{} in the research", keyword));
                if challenges.len() >= 2 {
                    break;
                }
            }
        }

        if challenges.is_empty() {
            challenges.push("unexpected complexities".to_string());
        }

        challenges
    }

    fn extract_results(text: &str) -> Vec<String> {
        let result_keywords = ["result", "finding", "conclusion", "demonstrate",
                              "show", "reveal", "indicate", "suggest"];
        
        let mut results = Vec::new();
        for keyword in result_keywords {
            if text.to_lowercase().contains(keyword) {
                results.push(format!("significant {}", keyword));
                if results.len() >= 2 {
                    break;
                }
            }
        }

        if results.is_empty() {
            results.push("meaningful scientific discoveries".to_string());
        }

        results
    }
}

/// Internal struct for paper analysis
#[derive(Debug)]
struct PaperAnalysis {
    word_count: usize,
    sentence_count: usize,
    key_themes: Vec<String>,
    problem: String,
    methods: Vec<String>,
    challenges: Vec<String>,
    results: Vec<String>,
}
