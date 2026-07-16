import React from "react";
import { Link } from "react-router-dom";
import ScoreGauge from "../components/ScoreGauge.jsx";

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="mb-4 inline-block rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-muted">
            for Fresher Job Seekers-
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Know your resume's score{" "}
            <span className="text-gold">before</span> the recruiter does.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Paste your resume against any job description and get an instant ATS-style
            score, missing keywords, and a live AI mock interview to pressure-test your answers.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-gold px-6 py-3 text-sm font-medium text-base transition hover:brightness-110"
            >
              Analyze my resume
            </Link>
            <Link
              to="/mock-interview"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm text-ink transition hover:border-teal hover:text-teal"
            >
              Try a mock interview
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-surface p-8 shadow-glow">
            <ScoreGauge score={78} />
            <p className="mt-4 text-center font-mono text-xs text-muted">sample analysis</p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-surface/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 md:grid-cols-3">
          {[
            {
              title: "01 — Resume Analyzer",
              body: "Rule-based keyword matching against any job description, plus optional live AI scoring.",
            },
            {
              title: "02 — Mock Interview",
              body: "Role-specific technical questions with real-time feedback delivered over a live socket connection.",
            },
            {
              title: "03 — Track Progress",
              body: "Every analysis and interview session is saved to your dashboard so you can see improvement over time.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-white/5 p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-teal">{f.title}</h3>
              <p className="mt-3 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
