// Thin wrapper around an LLM provider. If OPENAI_API_KEY is not set, every
// function resolves to null and the caller falls back to rule-based logic —
// this keeps the whole app demo-able with zero external dependencies.

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function callOpenAI(messages, { temperature = 0.6, maxTokens = 400 } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI call failed:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("OpenAI call error:", err.message);
    return null;
  }
}

async function generateInterviewQuestion({ role, difficulty, previousQA }) {
  const history = (previousQA || [])
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
    .join("\n\n");

  const messages = [
    {
      role: "system",
      content:
        "You are a technical interviewer for a MERN stack fresher role. Ask one concise, specific interview question at a time. Do not repeat earlier questions. Return only the question text, no numbering or preamble.",
    },
    {
      role: "user",
      content: `Role: ${role}\nDifficulty: ${difficulty}\nPrevious Q&A:\n${history || "(none yet, ask an opening question)"}\n\nAsk the next question.`,
    },
  ];

  return callOpenAI(messages, { temperature: 0.7, maxTokens: 120 });
}

async function evaluateAnswer({ role, question, answer }) {
  const messages = [
    {
      role: "system",
      content:
        "You are a strict but encouraging technical interviewer. Score the candidate's answer from 0-10 and give 2-3 sentences of specific, actionable feedback. Respond ONLY as JSON: {\"score\": number, \"feedback\": string}",
    },
    {
      role: "user",
      content: `Role: ${role}\nQuestion: ${question}\nCandidate answer: ${answer}`,
    },
  ];

  const raw = await callOpenAI(messages, { temperature: 0.3, maxTokens: 200 });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.score === "number" && typeof parsed.feedback === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

module.exports = { generateInterviewQuestion, evaluateAnswer, isAIEnabled: () => Boolean(process.env.OPENAI_API_KEY) };
