import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", targetRole: "Full Stack Developer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.targetRole);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Start tracking your resume score and interview reps.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <select
          value={form.targetRole}
          onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
          className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
        >
          <option>Full Stack Developer</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          disabled={loading}
          className="mt-2 rounded-lg bg-gold px-4 py-3 text-sm font-medium text-base transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-teal hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
