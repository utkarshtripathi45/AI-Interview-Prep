const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("../middleware/auth");
const { analyze, analyzeFromFile, history, getOne } = require("../controllers/resumeController");

// Keep the PDF in memory (no disk writes) and cap size at 5MB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

router.post("/analyze", auth, analyze);
router.post("/upload", auth, upload.single("resumeFile"), analyzeFromFile);
router.get("/history", auth, history);
router.get("/:id", auth, getOne);

module.exports = router;
