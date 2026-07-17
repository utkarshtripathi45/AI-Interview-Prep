const InterviewSession = require("../models/InterviewSession");
const { generateInterviewQuestion, evaluateAnswer, isAIEnabled } = require("../utils/aiService");
const { getQuestion } = require("../utils/questionBank");
const { emitSessionStatus } = require("../socket/interviewSocket");

async function nextQuestionFor(session) {
  const aiQuestion = isAIEnabled()
    ? await generateInterviewQuestion({
        role: session.role,
        difficulty: session.difficulty,
        previousQA: session.qaPairs,
      })
    : null;

  return (
    aiQuestion ||
    getQuestion({
      role: session.role,
      difficulty: session.difficulty,
      askedQuestions: session.qaPairs.map((qa) => qa.question),
    })
  );
}

exports.startSession = async (req, res) => {
  try {
    const { role, difficulty } = req.body;
    const session = await InterviewSession.create({
      user: req.userId,
      role: role || "Full Stack Developer",
      difficulty: difficulty || "medium",
      qaPairs: [],
    });

    const question = await nextQuestionFor(session);
    session.qaPairs.push({ question, answer: "", feedback: "", score: 0 });
    await session.save();

    res.status(201).json({ session, aiEnabled: isAIEnabled() });
  } catch (err) {
    res.status(500).json({ message: "Could not start session", error: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer } = req.body;

    const session = await InterviewSession.findOne({ _id: sessionId, user: req.userId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const currentIndex = session.qaPairs.length - 1;
    const currentQA = session.qaPairs[currentIndex];
    currentQA.answer = answer || "";

    emitSessionStatus(sessionId, "thinking");

    let evaluation = isAIEnabled()
      ? await evaluateAnswer({ role: session.role, question: currentQA.question, answer })
      : null;

    if (!evaluation) {
      // Rule-based fallback- score by answer length/specificity as a rough proxy.
      const words = (answer || "").trim().split(/\s+/).filter(Boolean).length;
      const score = Math.min(10, Math.max(1, Math.round(words / 12)));
      evaluation = {
        score,
        feedback:
          words < 15
            ? "Answer is quite short — expand with a concrete example or the 'why' behind your approach."
            : "Solid attempt. Try structuring it as: concept → example → trade-off, to sound more senior.",
      };
    }

    currentQA.feedback = evaluation.feedback;
    currentQA.score = evaluation.score;

    const totalQuestions = session.qaPairs.length;
    const MAX_QUESTIONS = 5;

    if (totalQuestions < MAX_QUESTIONS) {
      const nextQuestion = await nextQuestionFor(session);
      session.qaPairs.push({ question: nextQuestion, answer: "", feedback: "", score: 0 });
    } else {
      session.status = "completed";
    }

    session.averageScore =
      session.qaPairs.filter((qa) => qa.answer).reduce((sum, qa) => sum + qa.score, 0) /
      Math.max(1, session.qaPairs.filter((qa) => qa.answer).length);

    await session.save();
    emitSessionStatus(sessionId, "done", { session });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: "Could not submit answer", error: err.message });
  }
};

exports.history = async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ sessions });
};

exports.getOne = async (req, res) => {
  const session = await InterviewSession.findOne({ _id: req.params.id, user: req.userId });
  if (!session) return res.status(404).json({ message: "Not found" });
  res.json({ session });
};

exports.nextQuestionFor = nextQuestionFor;
