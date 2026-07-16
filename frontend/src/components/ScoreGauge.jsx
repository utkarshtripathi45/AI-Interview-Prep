import React from "react";

export default function ScoreGauge({ score = 0, label = "ATS Score" }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? "#4DD4AC" : score >= 45 ? "#F2B705" : "#F2617A";

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg width="176" height="176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} stroke="#242741" strokeWidth="12" fill="none" />
        <circle
          cx="88"
          cy="88"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.6s" }}
        />
      </svg>
      <div className="absolute inset-3 overflow-hidden rounded-full">
        <div className="absolute inset-x-0 h-1/2 animate-scan bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-semibold" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
      </div>
    </div>
  );
}
