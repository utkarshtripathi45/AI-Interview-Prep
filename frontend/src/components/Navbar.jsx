import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/resume-analyzer", label: "Resume Analyzer" },
    { to: "/mock-interview", label: "Mock Interview" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold text-base">▲</span>
          Prepped
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop auth controls */}
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <span className="text-sm text-muted">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-ink transition hover:border-danger hover:text-danger"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted hover:text-ink transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gold px-4 py-1.5 text-sm font-medium text-base transition hover:brightness-110"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink md:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-base px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
            {user ? (
              <>
                <span className="px-3 text-sm text-muted">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                    navigate("/");
                  }}
                  className="rounded-lg border border-white/10 px-3 py-2.5 text-left text-sm text-ink transition hover:border-danger hover:text-danger"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-ink"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-medium text-base transition hover:brightness-110"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
