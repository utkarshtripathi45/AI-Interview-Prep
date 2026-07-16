const BANK = {
  "Frontend Developer": {
    easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the box model in CSS.",
      "What is the virtual DOM in React and why is it used?",
    ],
    medium: [
      "How do useEffect dependencies affect when the effect runs?",
      "Explain the difference between controlled and uncontrolled components in React.",
      "How would you optimize a React app that re-renders too often?",
    ],
    hard: [
      "Walk through how React's reconciliation algorithm decides what to re-render.",
      "How would you implement code-splitting and lazy loading in a large React app?",
      "Design the state management approach for a real-time collaborative editor.",
    ],
  },
  "Backend Developer": {
    easy: [
      "What is middleware in Express.js?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is a REST API and what makes an API RESTful?",
    ],
    medium: [
      "How does JWT authentication work end to end?",
      "Explain indexing in MongoDB and when it helps performance.",
      "How would you handle file uploads securely in a Node.js API?",
    ],
    hard: [
      "How would you design rate limiting for a public API?",
      "Explain how you'd scale a Node.js app horizontally with session management.",
      "Walk through securing a Node/Express API against common OWASP risks.",
    ],
  },
  "Full Stack Developer": {
    easy: [
      "What does the MERN stack stand for and how do the pieces connect?",
      "What is the difference between npm and npx?",
      "How does the browser render a webpage from an HTML file?",
    ],
    medium: [
      "Walk me through the data flow when a user submits a form in a MERN app, end to end.",
      "How do you handle authentication and protected routes across frontend and backend?",
      "Explain how you'd structure a MongoDB schema for a many-to-many relationship.",
    ],
    hard: [
      "How would you design a real-time notification system in a MERN app?",
      "Describe your approach to deploying a full MERN app with CI/CD.",
      "How would you debug a memory leak in a Node.js production server?",
    ],
  },
};

function getQuestion({ role, difficulty, askedQuestions = [] }) {
  const roleBank = BANK[role] || BANK["Full Stack Developer"];
  const pool = roleBank[difficulty] || roleBank.medium;
  const remaining = pool.filter((q) => !askedQuestions.includes(q));
  const source = remaining.length > 0 ? remaining : pool;
  return source[Math.floor(Math.random() * source.length)];
}

module.exports = { getQuestion, ROLES: Object.keys(BANK) };
