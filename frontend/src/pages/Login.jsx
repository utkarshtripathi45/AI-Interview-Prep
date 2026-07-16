import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to continue your prep.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          disabled={loading}
          className="mt-2 rounded-lg bg-gold px-4 py-3 text-sm font-medium text-base transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link to="/register" className="text-teal hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
