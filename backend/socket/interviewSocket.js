let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("join-session", (sessionId) => {
      if (sessionId) socket.join(`session:${sessionId}`);
    });

    socket.on("leave-session", (sessionId) => {
      if (sessionId) socket.leave(`session:${sessionId}`);
    });

    socket.on("disconnect", () => {
      // no-op, room membership is cleaned up automatically
    });
  });
}

// Emit a live status ("thinking" | "done") to everyone watching a session —
// drives the "AI is analyzing your answer..." indicator on the frontend.
function emitSessionStatus(sessionId, status, payload = {}) {
  if (!ioInstance) return;
  ioInstance.to(`session:${sessionId}`).emit("session-status", { status, ...payload });
}

module.exports = { initSocket, emitSessionStatus };
