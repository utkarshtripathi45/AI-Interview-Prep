const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { analyze, history, getOne } = require("../controllers/resumeController");

router.post("/analyze", auth, analyze);
router.get("/history", auth, history);
router.get("/:id", auth, getOne);

module.exports = router;
