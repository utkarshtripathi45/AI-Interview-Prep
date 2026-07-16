import React from "react";

export default function KeywordTags({ title, keywords, variant = "matched" }) {
  const styles =
    variant === "matched"
      ? "border-teal/30 bg-teal/10 text-teal"
      : "border-danger/30 bg-danger/10 text-danger";

  return (
    <div>
      <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">{title}</h4>
      {keywords.length === 0 ? (
        <p className="text-sm text-muted">None</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs ${styles}`}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
