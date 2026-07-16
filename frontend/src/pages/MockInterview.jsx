import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { QuestionBubble, AnswerBubble, FeedbackBubble } from "../components/ChatBubble.jsx";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function MockInterview() {
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("medium");
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { autoConnect: true });
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!session?._id) return;
    const socket = socketRef.current;
    socket.emit("join-session", session._id);

    const onStatus = (payload) => {
      if (payload.status === "thinking") setThinking(true);
      if (payload.status === "done") {
        setThinking(false);
        if (payload.session) setSession(payload.session);
      }
    };
    socket.on("session-status", onStatus);
    return () => {
      socket.emit("leave-session", session._id);
      socket.off("session-status", onStatus);
    };
  }, [session?._id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [session, thinking]);

  const startInterview = async () => {
    setError("");
    setStarting(true);
    try {
      const { data } = await api.post("/interview/start", { role, difficulty });
      setSession(data.session);
    } catch (err) {
      setError(err.response?.data?.message || "Could not start — are you logged in?");
    } finally {
      setStarting(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim() || !session) return;
    setError("");
    try {
      const { data } = await api.post(`/interview/${session._id}/answer`, { answer });
      setSession(data.session);
      setAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit answer");
    }
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold">Mock Interview</h1>
        <p className="mt-2 text-muted">
          Pick a role and difficulty. You'll get 5 questions with live feedback after each answer.
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-6">
          <label className="text-sm text-muted">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-4 py-3 text-sm text-ink outline-none focus:border-gold"
            >
              <option>Full Stack Developer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
            </select>
          </label>
          <label className="text-sm text-muted">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-base px-4 py-3 text-sm text-ink outline-none focus:border-gold"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            onClick={startInterview}
            disabled={starting}
            className="rounded-lg bg-gold px-5 py-3 text-sm font-medium text-base transition hover:brightness-110 disabled:opacity-60"
          >
            {starting ? "Starting..." : "Start interview"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{session.role} — {session.difficulty}</h1>
          <p className="text-sm text-muted">
            Question {session.qaPairs.length} of 5 {session.status === "completed" && "· Completed"}
          </p>
        </div>
        {session.status === "completed" && (
          <div className="text-right">
            <p className="font-mono text-2xl font-semibold text-teal">{session.averageScore.toFixed(1)}/10</p>
            <p className="font-mono text-xs text-muted">avg score</p>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto rounded-2xl border border-white/10 bg-base/40 p-6">
        {session.qaPairs.map((qa, i) => (
          <React.Fragment key={i}>
            <QuestionBubble>{qa.question}</QuestionBubble>
            {qa.answer && <AnswerBubble>{qa.answer}</AnswerBubble>}
            {qa.feedback && <FeedbackBubble feedback={qa.feedback} score={qa.score} />}
          </React.Fragment>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-muted">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-teal" />
            <span className="font-mono text-xs">AI is analyzing your answer...</span>
          </div>
        )}
      </div>

      {session.status !== "completed" ? (
        <form onSubmit={submitAnswer} className="mt-4 flex gap-3">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <button className="rounded-lg bg-gold px-5 py-3 text-sm font-medium text-base transition hover:brightness-110">
            Send
          </button>
        </form>
      ) : (
        <button
          onClick={() => setSession(null)}
          className="mt-4 rounded-lg border border-white/10 px-5 py-3 text-sm text-ink transition hover:border-teal hover:text-teal"
        >
          Start another interview
        </button>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
