import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/5 bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-lg font-bold text-base">
              ▲
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">
                Prepped
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                AI Career Coach
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Helping freshers land their first role with ATS-grade resume scoring
            and real-time AI mock interviews.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-teal hover:text-teal"
            >
              in
            </a>
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-teal hover:text-teal"
            >
              gh
            </a>
            <a
              href="mailto:utkarshtripathi264@gmail.com"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-teal hover:text-teal"
            >
              @
            </a>
          </div>
        </div>

        {/* Get in touch */}
        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold">
            Get in touch
          </h3>
          <ul className="mt-4 flex flex-col gap-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">✉</span>
              <a href="mailto:utkarshtripathi264@gmail.com" className="text-ink hover:text-gold">
                utkarshtripathi264@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">☎</span>
              <span className="text-ink">+91-XXXXXXXXXX</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">📍</span>
              <span className="text-ink">Ghaziabad, UP</span>
            </li>
          </ul>
        </div>

        {/* Developer profile */}
        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-teal">
            Developer profile
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <img
              src="/developer-photo.jpg"
              alt="Utkarsh Tripathi"
              className="h-16 w-16 rounded-full border-2 border-gold/40 object-cover"
            />
            <div>
              <p className="font-display text-lg font-semibold leading-tight">Utkarsh Tripathi</p>
              <p className="text-sm text-muted">Full Stack Developer · Fresher</p>
            </div>
          </div>
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-gold hover:underline"
          >
            View portfolio →
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Prepped. Built with precision for the future.</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
            made with <span className="text-danger">♥</span> by Utkarsh Tripathi
          </span>
        </div>
      </div>
    </footer>
  );
}
