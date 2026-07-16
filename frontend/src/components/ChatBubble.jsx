import React from "react";

export function QuestionBubble({ children }) {
  return (
    <div className="max-w-2xl rounded-2xl rounded-tl-sm border border-white/10 bg-surface px-5 py-4">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-gold">Interviewer</span>
      <p className="text-ink">{children}</p>
    </div>
  );
}

export function AnswerBubble({ children }) {
  return (
    <div className="ml-auto max-w-2xl rounded-2xl rounded-tr-sm border border-teal/20 bg-teal/5 px-5 py-4">
      <span className="mb-1 block text-right font-mono text-[11px] uppercase tracking-widest text-teal">You</span>
      <p className="text-ink">{children}</p>
    </div>
  );
}

export function FeedbackBubble({ feedback, score }) {
  const color = score >= 7 ? "text-teal" : score >= 4 ? "text-gold" : "text-danger";
  return (
    <div className="max-w-2xl rounded-2xl rounded-tl-sm border border-dashed border-white/10 bg-surface/60 px-5 py-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Feedback</span>
        <span className={`font-mono text-sm font-medium ${color}`}>{score}/10</span>
      </div>
      <p className="text-sm text-muted">{feedback}</p>
    </div>
  );
}
