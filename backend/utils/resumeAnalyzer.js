// Rule-based ATS-style analyzer. No external API needed — mirrors the kind
// of keyword-matching logic real ATS systems use, so the score is a genuine
// signal even without an LLM call.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "will",
  "your", "you", "are", "was", "were", "who", "our", "their", "a", "an",
  "of", "to", "in", "on", "as", "is", "it", "at", "by", "or", "be",
]);

// Common MERN / fresher-relevant keyword pool used when no job description
// is supplied, so the tool is still useful for a general resume check.
const DEFAULT_KEYWORDS = [
  "react", "node", "express", "mongodb", "javascript", "html", "css",
  "rest api", "git", "github", "redux", "tailwind", "jwt", "authentication",
  "mongoose", "typescript", "socket.io", "deployment", "responsive",
  "api", "database", "frontend", "backend", "full stack",
];

function extractKeywords(text) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+.\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    )
  );
}

function analyzeResume({ resumeText, jobDescription }) {
  const resumeWords = new Set(extractKeywords(resumeText));
  const targetKeywords = jobDescription && jobDescription.trim().length > 0
    ? extractKeywords(jobDescription)
    : DEFAULT_KEYWORDS;

  const uniqueTargets = Array.from(new Set(targetKeywords));

  const matched = [];
  const missing = [];

  uniqueTargets.forEach((kw) => {
    const found = kw.split(" ").every((part) => resumeWords.has(part)) || resumeText.toLowerCase().includes(kw);
    if (found) matched.push(kw);
    else missing.push(kw);
  });

  const rawScore = uniqueTargets.length > 0 ? (matched.length / uniqueTargets.length) * 100 : 0;

  // Small bonuses for resume hygiene signals.
  let bonus = 0;
  if (/\d+%|\d+\+/.test(resumeText)) bonus += 5; // quantified impact
  if (/github\.com|vercel\.app|netlify\.app|render\.com/.test(resumeText.toLowerCase())) bonus += 5; // live links
  if (resumeText.split(/\s+/).length > 150) bonus += 3; // enough substance

  const score = Math.max(0, Math.min(100, Math.round(rawScore + bonus)));

  const suggestions = [];
  if (missing.length > 0) {
    suggestions.push(`Add these missing keywords naturally where true: ${missing.slice(0, 8).join(", ")}.`);
  }
  if (!/\d+%|\d+\+/.test(resumeText)) {
    suggestions.push("Quantify impact with numbers (e.g. '15+ REST APIs', 'reduced load time by 30%').");
  }
  if (!/github\.com|vercel\.app|netlify\.app|render\.com/.test(resumeText.toLowerCase())) {
    suggestions.push("Add live project links (GitHub repo + deployed demo URL).");
  }
  if (resumeText.split(/\s+/).length < 150) {
    suggestions.push("Resume looks thin — expand project bullets with tech stack and outcome.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Strong keyword coverage — focus next on tightening bullet phrasing for impact.");
  }

  return { score, matchedKeywords: matched, missingKeywords: missing, suggestions };
}

module.exports = { analyzeResume };
