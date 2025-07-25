export let socket;

export function connectWebSocket(onTranscript) {
  socket = new WebSocket("wss://61faa09c-5f3b-4e1e-a2cf-ce4c0ee48ce2-00-2hlb1raihlrrq.janeway.replit.dev/ws");

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
