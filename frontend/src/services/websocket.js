export let socket;

export function connectWebSocket(onTranscript) {
  socket = new WebSocket("wss://voiceflow-backend.onrender.com/ws");

  socket.onmessage = (event) => {
    onTranscript(event.data);
  };
}
