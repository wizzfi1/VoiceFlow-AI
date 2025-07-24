export let socket;

export function connectWebSocket(onTranscript) {
  socket = new WebSocket("ws://localhost:8000/ws");

  socket.onmessage = (event) => {
    onTranscript(event.data);
  };
}
