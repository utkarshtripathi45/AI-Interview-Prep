# Prepped — AI Resume Analyzer & Mock Interview Platform

A full MERN stack app for fresher job seekers: paste a resume against a job description
to get an ATS-style score, then run a live mock interview with real-time feedback over
Socket.io. Ships with a rule-based fallback so it works fully offline (no API key needed)
— add an OpenAI key to switch on live AI-generated questions and scoring.

## Stack
- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Socket.io-client, Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcrypt, Socket.io
- **AI layer:** OpenAI Chat Completions (optional) with a deterministic rule-based
  fallback for both resume scoring and interview Q&A — the app is demo-ready with zero
  external accounts.

## Features
- JWT auth (register/login), protected routes
- **Resume Analyzer** — keyword-matching ATS score, matched/missing keyword chips,
  actionable suggestions (quantify impact, add project links, etc.)
- **Mock Interview** — role + difficulty selection, 5-question live session, per-answer
  score + feedback, real-time "AI is analyzing..." indicator via Socket.io rooms
- **Dashboard** — history of past resume analyses and interview sessions

## Project structure
```
ai-interview-prep/
  backend/
    config/db.js
    models/            User, Resume, InterviewSession
    middleware/auth.js JWT verification
    utils/             resumeAnalyzer.js (rule-based scoring), questionBank.js
                        (offline questions), aiService.js (OpenAI wrapper)
    controllers/        auth, resume, interview
    routes/              auth, resume, interview
    socket/interviewSocket.js  Socket.io rooms + status events
    server.js
  frontend/
    src/
      api/axios.js       Axios instance with JWT interceptor
      context/AuthContext.jsx
      components/        Navbar, ScoreGauge, KeywordTags, ChatBubble, ProtectedRoute
      pages/              Home, Login, Register, Dashboard, ResumeAnalyzer, MockInterview
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm run dev                # starts on http://localhost:5000
```
Needs a running MongoDB (local `mongod` or a free MongoDB Atlas cluster URI in `MONGO_URI`).

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                # starts on http://localhost:5173
```

### 3. (Optional) Enable live AI
Add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) to `backend/.env`. Without it, the
app automatically uses the built-in rule-based analyzer and offline question bank — every
feature still works, just without live LLM calls.

## How the real-time piece works
When you submit an interview answer, the backend emits a `session-status: thinking` event
to everyone in that session's Socket.io room, evaluates the answer (AI or rule-based), saves
it, then emits `session-status: done` with the updated session. The frontend listens for
both events to show a live "AI is analyzing your answer..." indicator without polling.

## Deployment
- Backend → Render / Railway (set env vars, ensure `CLIENT_URL` matches your deployed frontend)
- Frontend → Vercel / Netlify (set `VITE_API_URL` / `VITE_SOCKET_URL` to the deployed backend)
- Database → MongoDB Atlas free tier

## Resume bullet points you can adapt
- Built a full-stack AI resume analyzer and mock-interview platform (MERN) with rule-based
  ATS scoring, JWT auth, and an optional OpenAI integration layer with graceful fallback.
- Implemented real-time interview feedback using Socket.io rooms, pushing live "AI thinking"
  status and scored feedback to the client without polling.
- Designed a rule-based keyword-matching engine to compute ATS-style resume scores against
  arbitrary job descriptions, achieving usable results with zero external API dependency.
