import React, { useState, useRef, useEffect } from "react";
import CitizenNavbar from "./components/CitizenNavbar";
import LocationSelector from "./components/LocationSelector";
import {
  FaMicrophoneAlt,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dictaphone from "./Dictaphone"; // Assuming Dictaphone.jsx exists and handles voice input
import { useNavigate } from "react-router-dom";

const CitizenPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [convertedText, setConvertedText] = useState(""); // This would come from an API
  const [locationData, setLocationData] = useState(null);
  const [hasProof, setHasProof] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [isKycVerified, setIsKycVerified] = useState(
    localStorage.getItem("isKycVerified")
  );
  const [showKycPrompt, setShowKycPrompt] = useState(
    isKycVerified !== "verified"
  ); // New state for controlling KYC prompt visibility

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const status = localStorage.getItem("isKycVerified");
      setIsKycVerified(status);
      setShowKycPrompt(status !== "verified"); // Update prompt visibility when storage changes
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Placeholder for Dictaphone's onResult callback
  const handleVoiceResult = (transcript) => {
    setVoiceMessage(transcript);
    // In a real application, you'd send `transcript` to a Nepali-to-English
    // translation/transcription API here and set `setConvertedText` with the result.
    setConvertedText(`(Translated: ${transcript})`); // Placeholder for translated text
    toast.success("Voice recorded!");
  };

  const handleLocationSelect = (data) => {
    setLocationData(data);
    toast.success("Location selected!");
  };

  const handleProofFileChange = (event) => {
    setProofFiles(Array.from(event.target.files));
    toast.success(`${event.target.files.length} file(s) selected.`);
  };

  const handleSubmitComplaint = () => {
    if (isKycVerified !== "verified") {
      toast.error("Only Verified Citizens can complain.");
      return;
    }

    if (!voiceMessage || !locationData) {
      toast.error("Please record your complaint and select a location.");
      return;
    }

    const complaintData = {
      voiceMessageNepali: voiceMessage,
      convertedTextEnglish: convertedText, // This would be the actual translated text
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      fullAddress: locationData.fullAddress,
      hasProof: hasProof,
      proofFiles: proofFiles.map((file) => file.name), // Just sending names for now
      priority: priority,
      // Authority would be determined by backend based on convertedTextEnglish
    };

    console.log("Submitting Complaint:", complaintData);
    toast.success("Complaint submitted successfully! (Simulated)");
    // Here you would typically send `complaintData` to your backend API
    // axios.post('/api/complaints', complaintData);

    // Reset form
    setCurrentStep(1);
    setVoiceMessage("");
    setConvertedText("");
    setLocationData(null);
    setHasProof(false);
    setProofFiles([]);
    setPriority("Medium");
  };

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
        {!showKycPrompt && (
          <>
            <h1 className="text-5xl font-extrabold text-relaxed text-red-600 mb-2 text-center">
              Raise Your Complaint
            </h1>
            <p className="text-lg text-gray-900 mb-2 text-center">
              Your voice matters. Easily report issues with location and proof.
            </p>
          </>
        )}

        {showKycPrompt ? (
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-800 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              KYC Verification Required
            </h2>
            <p className="text-lg text-gray-900 mb-2">
              To file a complaint, you must first complete your KYC
              verification.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate("/citizen/kyc")}
                className="px-6 py-2 bg-blue-600 text-white font-bold  rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              >
                Go to KYC Verification
              </button>
              <button
                onClick={() => setShowKycPrompt(false)} // Hide the prompt
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
              >
                I will do later
              </button>
            </div>
            {isKycVerified === "pending" && (
              <p className="mt-2 text-yellow-600 font-semibold">
                Your KYC is currently under review. You will be notified through
                email once it's verified.
              </p>
            )}
          </div>
        ) : (
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
                    Click the microphone to speak your complaint:
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
                    className="px-6 py-3 bg-blue-800 text-white font-bold rounded-lg  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                      ? `${
                          locationData.fullAddress
                        } (Lat: ${locationData.latitude.toFixed(
                          4
                        )}, Lon: ${locationData.longitude.toFixed(4)})`
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
        )}
      </div>
    </div>
  );
};

export default CitizenPage;
