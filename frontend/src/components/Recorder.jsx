import React, { useState, useRef } from "react";
import { connectWebSocket, socket } from "../services/websocket";

export default function Recorder({ onText }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    connectWebSocket((text) => onText(text));
    mediaRecorder.start(250); // Send audio chunks every 250ms

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
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    // Stop the stream tracks
    streamRef.current?.getTracks().forEach((track) => track.stop());

    // Close the WebSocket connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

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
