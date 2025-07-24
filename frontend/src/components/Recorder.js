import React, { useState } from "react";
import { connectWebSocket, socket } from "../services/websocket";

export default function Recorder({ onText }) {
  const [recording, setRecording] = useState(false);
  let mediaRecorder;

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(250); // Send every 250ms

    connectWebSocket((text) => onText(text));

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        e.data.arrayBuffer().then((buffer) => {
          socket.send(buffer);
        });
      }
    };

    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    socket.close();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop" : "Start"} Recording
      </button>
    </div>
  );
}
