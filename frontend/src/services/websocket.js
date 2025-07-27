export let socket;

export function connectWebSocket(onTranscript) {
  socket = new WebSocket("wss://voiceflow-backend-crw0.onrender.com/ws");

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    onTranscript(event.data);
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.warn("⚠️ WebSocket closed:", event.reason || "No reason");
  };
}
