const Resume = require("../models/Resume");
const { analyzeResume } = require("../utils/resumeAnalyzer");
const pdfParse = require("pdf-parse");

exports.analyze = async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle } = req.body;
    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ message: "Paste a fuller resume (min ~30 characters)" });
    }

    const result = analyzeResume({ resumeText, jobDescription });

    const saved = await Resume.create({
      user: req.userId,
      jobTitle: jobTitle || "Full Stack Developer",
      resumeText,
      jobDescription: jobDescription || "",
      ...result,
    });

    res.status(201).json({ resume: saved });
  } catch (err) {
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
};

// Accepts a PDF file (multipart/form-data, field name "resumeFile"), extracts
// its text with pdf-parse, then runs the same rule-based analysis as /analyze.
exports.analyzeFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const { jobDescription, jobTitle } = req.body;

    let extractedText = "";
    try {
      const parsed = await pdfParse(req.file.buffer);
      extractedText = parsed.text || "";
    } catch (parseErr) {
      return res.status(400).json({ message: "Could not read PDF — is it a valid, non-scanned PDF?" });
    }

    if (extractedText.trim().length < 30) {
      return res.status(400).json({
        message: "Couldn't extract enough text from this PDF. It may be a scanned image — try pasting the text instead.",
      });
    }

    const result = analyzeResume({ resumeText: extractedText, jobDescription });

    const saved = await Resume.create({
      user: req.userId,
      jobTitle: jobTitle || "Full Stack Developer",
      resumeText: extractedText,
      jobDescription: jobDescription || "",
      ...result,
    });

    res.status(201).json({ resume: saved });
  } catch (err) {
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
};

exports.history = async (req, res) => {
  const resumes = await Resume.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .select("-resumeText -jobDescription");
  res.json({ resumes });
};

exports.getOne = async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
  if (!resume) return res.status(404).json({ message: "Not found" });
  res.json({ resume });
};
