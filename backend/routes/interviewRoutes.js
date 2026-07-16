const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { startSession, submitAnswer, history, getOne } = require("../controllers/interviewController");

router.post("/start", auth, startSession);
router.post("/:sessionId/answer", auth, submitAnswer);
router.get("/history", auth, history);
router.get("/:id", auth, getOne);

module.exports = router;
