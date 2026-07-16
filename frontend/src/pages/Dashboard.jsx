import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [resumeRes, interviewRes] = await Promise.all([
          api.get("/resume/history"),
          api.get("/interview/history"),
        ]);
        setResumes(resumeRes.data.resumes);
        setSessions(interviewRes.data.sessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="mt-2 text-muted">Targeting: {user?.targetRole}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Resume analyses</h2>
            <Link to="/resume-analyzer" className="font-mono text-xs text-gold hover:underline">+ new</Link>
          </div>
          <div className="flex flex-col gap-3">
            {loading && <p className="text-sm text-muted">Loading...</p>}
            {!loading && resumes.length === 0 && (
              <p className="rounded-lg border border-white/5 bg-surface px-4 py-6 text-center text-sm text-muted">
                No analyses yet.
              </p>
            )}
            {resumes.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-surface px-4 py-3">
                <div>
                  <p className="text-sm text-ink">{r.jobTitle}</p>
                  <p className="font-mono text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-mono text-lg font-semibold text-gold">{r.score}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Interview sessions</h2>
            <Link to="/mock-interview" className="font-mono text-xs text-teal hover:underline">+ new</Link>
          </div>
          <div className="flex flex-col gap-3">
            {loading && <p className="text-sm text-muted">Loading...</p>}
            {!loading && sessions.length === 0 && (
              <p className="rounded-lg border border-white/5 bg-surface px-4 py-6 text-center text-sm text-muted">
                No interview sessions yet.
              </p>
            )}
            {sessions.map((s) => (
              <div key={s._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-surface px-4 py-3">
                <div>
                  <p className="text-sm text-ink">{s.role} · {s.difficulty}</p>
                  <p className="font-mono text-xs text-muted">{new Date(s.createdAt).toLocaleDateString()} · {s.status}</p>
                </div>
                <span className="font-mono text-lg font-semibold text-teal">{s.averageScore?.toFixed(1) || "—"}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
