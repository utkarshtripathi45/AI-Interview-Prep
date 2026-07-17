import React, { useState } from "react";
import api from "../api/axios";
import ScoreGauge from "../components/ScoreGauge.jsx";
import KeywordTags from "../components/KeywordTags.jsx";

export default function ResumeAnalyzer() {
  const [mode, setMode] = useState("paste"); // "paste" | "upload"
  const [form, setForm] = useState({ jobTitle: "Full Stack Developer", resumeText: "", jobDescription: "" });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("PDF must be under 5MB");
      return;
    }
    setError("");
    setFile(selected);
    setFileName(selected.name);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      if (mode === "paste") {
        const { data } = await api.post("/resume/analyze", form);
        setResult(data.resume);
      } else {
        if (!file) {
          setError("Choose a PDF file first");
          setLoading(false);
          return;
        }
        const payload = new FormData();
        payload.append("resumeFile", file);
        payload.append("jobTitle", form.jobTitle);
        payload.append("jobDescription", form.jobDescription);

        const { data } = await api.post("/resume/upload", payload);
        setResult(data.resume);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed — are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold">Resume Analyzer</h1>
      <p className="mt-2 max-w-xl text-muted">
        Paste your resume text or upload a PDF, plus (optionally) a job description. You'll get
        an ATS-style score, matched vs. missing keywords, and concrete suggestions.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          {/* Mode switcher */}
          <div className="flex gap-2 rounded-lg border border-white/10 bg-surface p-1">
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === "paste" ? "bg-gold text-base" : "text-muted hover:text-ink"
              }`}
            >
              Paste text
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === "upload" ? "bg-gold text-base" : "text-muted hover:text-ink"
              }`}
            >
              Upload PDF
            </button>
          </div>

          <input
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            placeholder="Target job title"
            className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
          />

          {mode === "paste" ? (
            <textarea
              required
              rows={10}
              value={form.resumeText}
              onChange={(e) => setForm({ ...form, resumeText: e.target.value })}
              placeholder="Paste your resume text here..."
              className="rounded-lg border border-white/10 bg-surface px-4 py-3 font-mono text-sm outline-none focus:border-gold"
            />
          ) : (
            <label
              htmlFor="resume-pdf"
              className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-surface text-center transition hover:border-gold"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {fileName ? "Selected file" : "Click to choose a PDF"}
              </span>
              <span className="max-w-[80%] truncate text-sm text-ink">
                {fileName || "PDF only, up to 5MB"}
              </span>
              <input
                id="resume-pdf"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          <textarea
            rows={6}
            value={form.jobDescription}
            onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
            placeholder="Paste a job description (optional — leave blank for a general MERN fresher check)"
            className="rounded-lg border border-white/10 bg-surface px-4 py-3 font-mono text-sm outline-none focus:border-gold"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            disabled={loading}
            className="rounded-lg bg-gold px-5 py-3 text-sm font-medium text-base transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze resume"}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          {!result && !loading && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted">
              <p className="font-mono text-sm">Your analysis will appear here</p>
            </div>
          )}
          {loading && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-muted">
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-gold" />
              <p className="font-mono text-sm">Scanning resume...</p>
            </div>
          )}
          {result && (
            <div className="flex flex-col items-center gap-6">
              <ScoreGauge score={result.score} />
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                <KeywordTags title="Matched keywords" keywords={result.matchedKeywords} variant="matched" />
                <KeywordTags title="Missing keywords" keywords={result.missingKeywords} variant="missing" />
              </div>
              <div className="w-full">
                <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">Suggestions</h4>
                <ul className="flex flex-col gap-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="rounded-lg border border-white/5 bg-base/50 px-4 py-3 text-sm text-ink">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
