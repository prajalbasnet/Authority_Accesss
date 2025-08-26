import React, { useState, useRef } from "react";
import { classifyComplaint } from "../utils/nlpClassifier";
import { useAuth } from "../contexts/AuthContext";
// import firebase storage/upload logic here
// import Dropzone for file uploads

const ComplaintForm: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const recognitionRef = useRef<any>(null);
  const { currentUser } = useAuth();

  // Voice recording (Web Speech API)
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported!");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "ne-NP";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleClassify(text);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  // Classify complaint
  const handleClassify = (text: string) => {
    const result = classifyComplaint({ title: text, description: text });
    setCategory(result.category);
    setPriority(result.priority);
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Submit complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Upload files to Firebase, save complaint to DB
    alert("Complaint submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-crimson">File a Complaint</h2>
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className="mb-2 px-4 py-2 bg-blue-700 text-white rounded"
      >
        {recording ? "Stop Recording" : "Start Voice Recording"}
      </button>
      <textarea
        value={transcript}
        onChange={(e) => {
          setTranscript(e.target.value);
          handleClassify(e.target.value);
        }}
        placeholder="Or type your complaint here..."
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (auto or manual)"
        className="w-full p-2 border rounded mb-2"
      />
      <label className="block mb-2">
        Upload Citizenship/Passport/Authority ID:
      </label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-2"
      />
      <div className="mb-2">
        <strong>Category:</strong> {category}
      </div>
      <div className="mb-2">
        <strong>Priority:</strong> {priority}
      </div>
      <button type="submit" className="px-4 py-2 bg-crimson text-white rounded">
        Submit Complaint
      </button>
    </form>
  );
};

export default ComplaintForm;
