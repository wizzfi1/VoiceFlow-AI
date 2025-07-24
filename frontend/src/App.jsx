import React, { useState } from "react";
import Recorder from "./components/Recorder";

function App() {
  const [transcript, setTranscript] = useState("");

  return (
    <div className="App">
      <h1>VoiceFlow AI</h1>
      <Recorder onText={(text) => setTranscript((t) => t + " " + text)} />
      <div>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
}

export default App;
