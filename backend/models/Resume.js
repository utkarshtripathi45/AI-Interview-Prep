const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobTitle: { type: String, required: true },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, default: "" },
    score: { type: Number, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
