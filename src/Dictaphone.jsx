import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaStop, FaRedo } from 'react-icons/fa';

const Dictaphone = ({ onResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && onResult) {
      onResult(transcript, false); // Do not show toast on every update
    }
  }, [transcript, onResult]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-600 font-semibold text-center">
        Browser doesn't support speech recognition. Please try Chrome or Edge.
      </div>
    );
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'ne-NP' }); // Attempting Nepali language
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (onResult) {
      onResult(transcript, true); // Show toast only when stopped
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={startListening}
          disabled={listening}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${listening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${listening ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          title="Start Recording"
        >
          <FaMicrophone size={24} />
        </button>
        <button
          onClick={stopListening}
          disabled={!listening}
          className="p-4 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          title="Stop Recording"
        >
          <FaStop size={24} />
        </button>
        <button
          onClick={resetTranscript}
          className="p-4 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          title="Reset Transcript"
        >
          <FaRedo size={24} />
        </button>
      </div>
      {listening && <p className="text-sm text-red-600 font-semibold">Listening...</p>}
      {transcript && (
        <div className="w-full p-3 bg-gray-50 rounded-md border border-gray-200 text-center">
          <p className="text-gray-800"><strong>Transcript:</strong> {transcript}</p>
        </div>
      )}
    </div>
  );
};

export default Dictaphone;
