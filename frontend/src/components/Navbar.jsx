import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold text-base">▲</span>
          Prepped
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <Link to="/resume-analyzer" className="hover:text-ink transition-colors">Resume Analyzer</Link>
          <Link to="/mock-interview" className="hover:text-ink transition-colors">Mock Interview</Link>
          <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
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
              <Link to="/login" className="text-sm text-muted hover:text-ink transition-colors">Log in</Link>
              <Link
                to="/register"
                className="rounded-lg bg-gold px-4 py-1.5 text-sm font-medium text-base transition hover:brightness-110"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
