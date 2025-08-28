import React, { useState, useRef, useEffect } from "react";
import CitizenNavbar from "./components/CitizenNavbar";
import LocationSelector from "./components/LocationSelector";
import {
  FaMicrophoneAlt,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay, // Added for audio playback
  FaStop, // Added for audio stop
  FaRedo // Added for audio reset
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dictaphone from "./Dictaphone";
import { Link, useNavigate } from "react-router-dom";

const CitizenPage = () => {
  // Initialize state from sessionStorage or default values
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-currentStep');
    return saved ? parseInt(saved) : 1;
  });
  const [voiceMessage, setVoiceMessage] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-voiceMessage');
    return saved ? saved : "";
  });
  const [convertedText, setConvertedText] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-convertedText');
    return saved ? saved : "";
  });
  const [locationData, setLocationData] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-locationData');
    return saved ? JSON.parse(saved) : null;
  });
  const [hasProof, setHasProof] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-hasProof');
    return saved ? JSON.parse(saved) : false;
  });
  const [proofFiles, setProofFiles] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-proofFiles');
  
    return saved ? JSON.parse(saved) : [];
  });
  const [priority, setPriority] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-priority');
    return saved ? saved : "Medium";
  });
  
  const [kycStatus, setKycStatus] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (user && user.status) ? user.status.toUpperCase() : "UNVERIFIED";
  });

  const [showKycPrompt, setShowKycPrompt] = useState(
    () => kycStatus === "UNVERIFIED" || kycStatus === "REJECTED"
  );

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // New state for audio recording
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioBlob, setAudioBlob] = useState(() => {
    const saved = sessionStorage.getItem('complaint-form-audioBlob');
    if (saved) {
      // Convert base64 string back to Blob
      const byteString = atob(saved.split(',')[1]);
      const mimeString = saved.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }
    return null;
  });
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const audioRef = useRef(null); // For audio playback
  const mediaStreamRef = useRef(null); // To hold the media stream

  // Save form data to sessionStorage on state changes
  useEffect(() => {
    sessionStorage.setItem('complaint-form-currentStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem('complaint-form-voiceMessage', voiceMessage);
  }, [voiceMessage]);

  useEffect(() => {
    sessionStorage.setItem('complaint-form-convertedText', convertedText);
  }, [convertedText]);

  useEffect(() => {
    sessionStorage.setItem('complaint-form-locationData', JSON.stringify(locationData));
  }, [locationData]);

  useEffect(() => {
    sessionStorage.setItem('complaint-form-hasProof', JSON.stringify(hasProof));
  }, [hasProof]);

  useEffect(() => {
    
    sessionStorage.setItem('complaint-form-proofFiles', JSON.stringify(proofFiles.map(file => ({ name: file.name, size: file.size, type: file.type }))));
  }, [proofFiles]);

  useEffect(() => {
    sessionStorage.setItem('complaint-form-priority', priority);
  }, [priority]);

  useEffect(() => {
    if (audioBlob) {
      // Convert Blob to base64 string for sessionStorage
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        sessionStorage.setItem('complaint-form-audioBlob', reader.result);
      };
    } else {
      sessionStorage.removeItem('complaint-form-audioBlob');
    }
  }, [audioBlob]);

  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const newStatus = (user && user.status) ? user.status.toUpperCase() : "UNVERIFIED";
      setKycStatus(newStatus);
      if (newStatus === "VERIFIED" || newStatus === "PENDING") {
        setShowKycPrompt(false);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Audio recording functions
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream; // Store the stream reference
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setAudioBlob(null);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          console.log("Audio data available, size:", event.data.size); // Log data chunks
        }
      };

      recorder.onstop = () => {
        console.log("MediaRecorder stopped. Audio chunks:", audioChunks.length); // Log onstop
        if (audioChunks.length > 0) {
          const blob = new Blob(audioChunks, { type: 'audio/webm' });
          setAudioBlob(blob);
          console.log("Audio Blob created:", blob.size, blob.type); // Log blob creation
        } else {
          console.warn("No audio data collected.");
          toast.warn("No audio recorded. Please ensure your microphone is working.");
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop()); // Stop microphone access
          mediaStreamRef.current = null;
        }
        setMediaRecorder(null); // Clear recorder reference
      };

      recorder.onerror = (event) => { // Add onerror handler
        console.error("MediaRecorder error:", event.error);
        toast.error(`Audio recording error: ${event.error.name}`);
        setIsRecordingAudio(false);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        setMediaRecorder(null);
      };

      recorder.start();
      setIsRecordingAudio(true);
      console.log("MediaRecorder state after start:", recorder.state); // Log recorder state
      toast.info("Audio recording started...");
    } catch (error) {
      console.error("Error starting audio recording:", error);
      toast.error("Failed to start audio recording. Please check microphone permissions.");
      setIsRecordingAudio(false); // Ensure recording state is reset on error
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      console.log("Stopping MediaRecorder. Current state:", mediaRecorder.state); // Log before stop
      mediaRecorder.stop();
      // setIsRecordingAudio(false); // This will be set in onstop
      toast.success("Audio recording stopped.");
    } else {
      console.warn("Attempted to stop recording when not active or in recording state.");
    }
  };

  const resetAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") { // Ensure recorder is stopped before resetting
      mediaRecorder.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setMediaRecorder(null);
    setAudioChunks([]);
    setAudioBlob(null);
    setIsRecordingAudio(false);
    toast.info("Audio recording reset.");
    console.log("Audio recording reset.");
  };

  const handleVoiceResult = (transcript) => {
    setVoiceMessage(transcript);
    setConvertedText(`(Translated: ${transcript})`);
    // toast.success("Voice recorded!"); // This toast is for speech-to-text, not audio file
  };

  const handleLocationSelect = (data) => {
    setLocationData(data);
    toast.success("Location selected!");
  };

  const handleProofFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + proofFiles.length > 2) {
      toast.error("You can upload a maximum of 2 files in total.");
      return;
    }
    setProofFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) selected.`);
  };

  const handleSubmitComplaint = async () => { // Added async
    if (kycStatus !== "VERIFIED") {
      toast.error("Only Verified Citizens can complain.");
      return;
    }

    if (!voiceMessage || !locationData) {
      toast.error("Please record your complaint and select a location.");
      return;
    }

    if (proofFiles.length > 2) { // Added file limit check
      toast.error("You can upload a maximum of 2 files.");
      return;
    }

    const formData = new FormData();
    formData.append("text", voiceMessage); // Mapping voiceMessage (Nepali text) to text

    if (audioBlob) {
      console.log("Audio Blob available, size:", audioBlob.size, "type:", audioBlob.type); // Added log
      formData.append("voiceClip", audioBlob, "voice_clip.webm"); // Appending the recorded audio blob
    } else {
      toast.error("Please record a voice clip.");
      console.error("Audio Blob is null, cannot submit voice clip."); // Added log
      return;
    }

    proofFiles.forEach((file) => {
      formData.append("mediaFiles", file); // Appending each file in mediaFiles
    });

    formData.append("latitude", locationData.latitude);
    formData.append("longitude", locationData.longitude);
    formData.append("fullAddress", locationData.fullAddress);

    try {
      const response = await fetch("/api/complaints/send", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Complaint submitted successfully!");
        // Clear form data from sessionStorage on successful submission
        sessionStorage.removeItem('complaint-form-currentStep');
        sessionStorage.removeItem('complaint-form-voiceMessage');
        sessionStorage.removeItem('complaint-form-convertedText');
        sessionStorage.removeItem('complaint-form-locationData');
        sessionStorage.removeItem('complaint-form-hasProof');
        sessionStorage.removeItem('complaint-form-proofFiles');
        sessionStorage.removeItem('complaint-form-priority');

        setCurrentStep(1);
        setVoiceMessage("");
        setConvertedText("");
        setLocationData(null);
        setHasProof(false);
        setProofFiles([]);
        setPriority("Medium");
        setAudioBlob(null); // Clear audio blob
        resetAudioRecording(); // Reset audio recording state
      } else {
        toast.error(result.message || "Failed to submit complaint.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred while submitting the complaint.");
    }
  };

  const isFormDisabled = kycStatus !== 'VERIFIED';

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <CitizenNavbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container mx-auto p-6">
        {showKycPrompt ? (
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-800 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              KYC Verification Required
            </h2>
            <p className="text-lg text-gray-900 mb-2">
              To file a complaint, you must first complete your KYC verification.
            </p>
            {kycStatus === 'REJECTED' && (
                <p className="my-3 text-red-600 font-semibold bg-red-100 p-2 rounded-md">
                    Your previous KYC submission was rejected. Please review and resubmit your details.
                </p>
            )}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate("/citizen/kyc")}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              >
                Go to KYC Verification
              </button>
              <button
                onClick={() => setShowKycPrompt(false)} // Hide the prompt
                className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
              >
                I will do it later
              </button>
            </div>
          </div>
        ) : (
          <>
            {kycStatus !== 'VERIFIED' && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow-md">
                <p className="font-bold">Action Required</p>
                <p>
                  Your account is <span className="font-bold">{kycStatus.toLowerCase()}</span>. To file a complaint, your status must be <span className="font-bold">Verified</span>.
                  Click on the status badge in the navigation bar to review your KYC details.
                </p>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold text-relaxed text-red-600 mb-2">
                Raise Your Complaint
              </h1>
              <p className="text-lg text-gray-900">
                Your voice matters. Easily report issues with location and proof.
              </p>
            </div>

            <div className={`${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-800">
                {/* Step 1: Voice Complaint & Location */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-blue-800 mb-2">
                      Step 1: Record Complaint & Select Location
                    </h2>

                    {/* Voice Recording Section */}
                    <div className="flex flex-col items-center space-y-4 bg-blue-50 border border-blue-200 p-2 rounded-lg shadow-md">
                      <p className="text-lg font-semibold text-red-600">
                        Record your voice complaint and get a transcript:
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={startAudioRecording}
                          disabled={isRecordingAudio}
                          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${isRecordingAudio ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${isRecordingAudio ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                          title="Start Audio Recording"
                        >
                          <FaMicrophoneAlt size={24} />
                        </button>
                        <button
                          onClick={stopAudioRecording}
                          disabled={!isRecordingAudio}
                          className="p-4 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          title="Stop Audio Recording"
                        >
                          <FaStop size={24} />
                        </button>
                        <button
                          onClick={resetAudioRecording}
                          disabled={isRecordingAudio || !audioBlob}
                          className="p-4 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                          title="Reset Audio Recording"
                        >
                          <FaRedo size={24} />
                        </button>
                      </div>
                      {isRecordingAudio && <p className="text-sm text-red-600 font-semibold">Recording audio...</p>}
                      {audioBlob && (
                        <div className="mt-2">
                          <audio ref={audioRef} src={URL.createObjectURL(audioBlob)} controls className="w-full"></audio>
                        </div>
                      )}
                      <p className="text-lg font-semibold text-red-600 mt-4">
                        (Optional) Use speech-to-text for a written transcript:
                      </p>
                      <Dictaphone onResult={handleVoiceResult} />
                      {voiceMessage && (
                        <div className="mt-4 p-3 bg-red-100 rounded-md w-full text-center">
                          <p className="text-red-600">
                            <strong>Your Voice (Nepali):</strong> {voiceMessage}
                          </p>
                          <p className="text-red-600">
                            <strong>Converted Text (English):</strong>{" "}
                            {convertedText}
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            *Nepali to English conversion requires an external API.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Location Selection Section */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
                      <LocationSelector onLocationSelect={handleLocationSelect} />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!voiceMessage || !locationData}
                        className="px-6 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Proof Upload & Priority */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">
                      Step 2: Add Proof & Set Priority
                    </h2>

                    {/* Proof Upload Section */}
                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm">
                      <p className="text-lg font-semibold text-red-700 mb-4">
                        Do you have any proof (image/video)?
                      </p>
                      <div className="flex space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setHasProof(true)}
                          className={`px-6 py-2 rounded-md font-semibold ${
                            hasProof
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          Yes <FaCheckCircle className="inline-block ml-2" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHasProof(false);
                            setProofFiles([]);
                          }}
                          className={`px-6 py-2 rounded-md font-semibold ${
                            !hasProof
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          No <FaTimesCircle className="inline-block ml-2" />
                        </button>
                      </div>

                      {hasProof && (
                        <div className="mt-4">
                          <label
                            htmlFor="proof-upload"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Upload Image/Video:
                          </label>
                          <input
                            type="file"
                            id="proof-upload"
                            ref={fileInputRef}
                            multiple
                            accept="image/*,video/*"
                            onChange={handleProofFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {proofFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              Selected files:{" "}
                              {proofFiles.map((file) => file.name).join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Priority Selection */}
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                      <p className="text-lg font-semibold text-blue-800 mb-4">
                        Set Priority:
                      </p>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setPriority("High")}
                          className={`px-6 py-2 rounded-md font-semibold ${
                            priority === "High"
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          High
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriority("Medium")}
                          className={`px-6 py-2 rounded-md font-semibold ${
                            priority === "Medium"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          Medium
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriority("Low")}
                          className={`px-6 py-2 rounded-md font-semibold ${
                            priority === "Low"
                              ? "bg-gray-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          Low
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Review & Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">
                      Step 3: Review Your Complaint
                    </h2>

                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm space-y-3">
                      <p className="text-lg font-semibold text-gray-700">
                        Complaint Details:
                      </p>
                      <p>
                        <strong>Voice Message (Nepali):</strong>{" "}
                        {voiceMessage || "N/A"}
                      </p>
                      <p>
                        <strong>Converted Text (English):</strong>{" "}
                        {convertedText || "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {locationData
                          ? `${locationData.fullAddress} (Lat: ${locationData.latitude.toFixed(4)}, Lon: ${locationData.longitude.toFixed(4)})`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Proof Attached:</strong>{" "}
                        {hasProof
                          ? proofFiles.length > 0
                            ? proofFiles.map((file) => file.name).join(", ")
                            : "Yes, but no files selected"
                          : "No"}
                      </p>
                      <p>
                        <strong>Priority:</strong> {priority}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmitComplaint}
                        className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Submit Complaint
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CitizenPage;