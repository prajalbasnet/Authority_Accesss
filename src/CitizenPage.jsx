import React, { useState, useRef, useEffect } from "react";
import CitizenNavbar from "./components/CitizenNavbar";
import LocationSelector from "./components/LocationSelector";
import {
  FaMicrophoneAlt,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaArrowLeft,
  FaPaperPlane,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dictaphone from "./Dictaphone";
import { Link, useNavigate } from "react-router-dom";

const CitizenPage = () => {
  // Initialize state from sessionStorage or default values
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-currentStep");
    return saved ? parseInt(saved) : 1;
  });
  const [voiceMessage, setVoiceMessage] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-voiceMessage");
    return saved ? saved : "";
  });
  const [convertedText, setConvertedText] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-convertedText");
    return saved ? saved : "";
  });
  const [locationData, setLocationData] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-locationData");
    return saved ? JSON.parse(saved) : null;
  });
  const [hasProof, setHasProof] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-hasProof");
    return saved ? JSON.parse(saved) : false;
  });
  const [proofFiles, setProofFiles] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-proofFiles");
    // Note: FileList cannot be directly stored/restored from JSON.
    // This will only restore file names, not the actual file objects.
    // For actual file persistence, you'd need a more complex solution (e.g., IndexedDB or server upload).
    return saved ? JSON.parse(saved) : [];
  });
  const [priority, setPriority] = useState(() => {
    const saved = sessionStorage.getItem("complaint-form-priority");
    return saved ? saved : "Medium";
  });

  const [kycStatus, setKycStatus] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.status ? user.status.toUpperCase() : "UNVERIFIED";
  });

  const [showKycPrompt, setShowKycPrompt] = useState(
    () => kycStatus === "UNVERIFIED" || kycStatus === "REJECTED"
  );

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Save form data to sessionStorage on state changes
  useEffect(() => {
    sessionStorage.setItem(
      "complaint-form-currentStep",
      currentStep.toString()
    );
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem("complaint-form-voiceMessage", voiceMessage);
  }, [voiceMessage]);

  useEffect(() => {
    sessionStorage.setItem("complaint-form-convertedText", convertedText);
  }, [convertedText]);

  useEffect(() => {
    sessionStorage.setItem(
      "complaint-form-locationData",
      JSON.stringify(locationData)
    );
  }, [locationData]);

  useEffect(() => {
    sessionStorage.setItem("complaint-form-hasProof", JSON.stringify(hasProof));
  }, [hasProof]);

  useEffect(() => {
    // Store only file names for proofFiles, as actual File objects cannot be serialized
    sessionStorage.setItem(
      "complaint-form-proofFiles",
      JSON.stringify(
        proofFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      )
    );
  }, [proofFiles]);

  useEffect(() => {
    sessionStorage.setItem("complaint-form-priority", priority);
  }, [priority]);

  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const newStatus =
        user && user.status ? user.status.toUpperCase() : "UNVERIFIED";
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

  const handleVoiceResult = (transcript) => {
    setVoiceMessage(transcript);
    setConvertedText(`(Translated: ${transcript})`);
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
    if (kycStatus !== "VERIFIED") {
      toast.error("Only Verified Citizens can complain.");
      return;
    }

    if (!voiceMessage || !locationData) {
      toast.error("Please record your complaint and select a location.");
      return;
    }

    const complaintData = {
      voiceMessageNepali: voiceMessage,
      convertedTextEnglish: convertedText,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      fullAddress: locationData.fullAddress,
      hasProof: hasProof,
      proofFiles: proofFiles.map((file) => file.name),
      priority: priority,
    };

    console.log("Submitting Complaint:", complaintData);
    // --- API Call for Complaint Submission ---
    // This is where you would send the complaintData to your backend API.
    // Example using fetch:
    fetch('/api/dummy-submit-complaint', { // Changed URL to dummy
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming authentication
        },
        body: JSON.stringify(complaintData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Complaint submitted successfully:', data);
        toast.success("Complaint submitted successfully!");
        // Clear form data from sessionStorage on successful submission
        sessionStorage.removeItem("complaint-form-currentStep");
        sessionStorage.removeItem("complaint-form-voiceMessage");
        sessionStorage.removeItem("complaint-form-convertedText");
        sessionStorage.removeItem("complaint-form-locationData");
        sessionStorage.removeItem("complaint-form-hasProof");
        sessionStorage.removeItem("complaint-form-proofFiles");
        sessionStorage.removeItem("complaint-form-priority");

        setCurrentStep(1);
        setVoiceMessage("");
        setConvertedText("");
        setLocationData(null);
        setHasProof(false);
        setProofFiles([]);
        setPriority("Medium");
    })
    .catch(error => {
        console.error('Error submitting complaint:', error);
        toast.error(`Failed to submit complaint: ${error.message}`);
    });
  };

  const isFormDisabled = kycStatus !== "VERIFIED";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* CitizenNavbar is typically handled by CitizenDashboardLayout now */}
      {/* <CitizenNavbar /> */}
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
          <div className="bg-white p-10 rounded-xl shadow-lg border border-red-700 text-center max-w-md mx-auto animate-fade-in">
            <FaExclamationTriangle className="text-red-700 text-6xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-700 mb-3">
              KYC Verification Required
            </h2>
            <p className="text-lg text-gray-800 mb-4">
              To file a complaint, you must first complete your KYC
              verification. This ensures the authenticity of your reports.
            </p>
            {kycStatus === "REJECTED" && (
              <p className="my-4 text-red-600 font-semibold bg-red-100 p-3 rounded-md border border-red-300">
                Your previous KYC submission was rejected. Please review and
                resubmit your details carefully.
              </p>
            )}
            <div className="flex flex-col space-y-4 mt-6">
              <button
                onClick={() => navigate("/citizen/kyc")}
                className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
              >
                <FaInfoCircle className="mr-2" /> Go to KYC Verification
              </button>
              <button
                onClick={() => setShowKycPrompt(false)} // Hide the prompt
                className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
              >
                I will do it later
              </button>
            </div>
          </div>
        ) : (
          <>
            {kycStatus !== "VERIFIED" && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow-md flex items-center">
                <FaInfoCircle className="text-xl mr-3" />
                <div>
                  <p className="font-bold">Action Required</p>
                  <p>
                    Your account is{" "}
                    <span className="font-bold">{kycStatus.toLowerCase()}</span>.
                    To file a complaint, your status must be{" "}
                    <span className="font-bold">Verified</span>. Click on the
                    status badge in the navigation bar to review your KYC details.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center mb-10">
              <h1 className="text-5xl font-extrabold text-red-700 mb-3 tracking-tight leading-tight">
                Raise Your Complaint
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Your voice matters. Easily report issues with precise location and supporting proof.
              </p>
            </div>

            <div
              className={`bg-white p-8 rounded-xl shadow-lg border border-blue-100 ${isFormDisabled ? "opacity-60 pointer-events-none" : ""}`}
            >
              {/* Step Indicators */}
              <div className="flex justify-around mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center ${currentStep >= step ? "text-blue-700" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg
                                ${currentStep > step ? "bg-blue-700" : currentStep === step ? "bg-red-700" : "bg-gray-300"}`}
                    >
                      {step}
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {step === 1 && "Record & Location"}
                      {step === 2 && "Proof & Priority"}
                      {step === 3 && "Review & Submit"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step 1: Voice Complaint & Location */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold text-blue-700 mb-4">
                    Step 1: Record Complaint & Select Location
                  </h2>

                  {/* Voice Recording Section */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      <FaMicrophoneAlt className="inline-block mr-2 text-red-600" />
                      Click the microphone to speak your complaint:
                    </p>
                    <Dictaphone onResult={handleVoiceResult} />
                    {voiceMessage && (
                      <div className="mt-5 p-4 bg-red-50 rounded-md w-full text-center border border-red-200">
                        <p className="text-red-700 text-lg">
                          <strong>Your Voice (Nepali):</strong> {voiceMessage}
                        </p>
                        <p className="text-red-700 text-lg">
                          <strong>Converted Text (English):</strong>{" "}
                          {convertedText}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          *Nepali to English conversion requires an external API.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Location Selection Section */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                    <LocationSelector
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!voiceMessage || !locationData}
                      className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                    >
                      Next Step <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Proof Upload & Priority */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold text-blue-700 mb-4">
                    Step 2: Add Proof & Set Priority
                  </h2>

                  {/* Proof Upload Section */}
                  <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      <FaUpload className="inline-block mr-2 text-blue-700" />
                      Do you have any supporting proof (image/video)?
                    </p>
                    <div className="flex space-x-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setHasProof(true)}
                        className={`px-6 py-2 rounded-md font-semibold text-lg transition-all duration-200 flex items-center
                          ${hasProof
                            ? "bg-red-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                        `}
                      >
                        Yes <FaCheckCircle className="inline-block ml-2" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHasProof(false);
                          setProofFiles([]);
                        }}
                        className={`px-6 py-2 rounded-md font-semibold text-lg transition-all duration-200 flex items-center
                          ${!hasProof
                            ? "bg-red-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                        `}
                      >
                        No <FaTimesCircle className="inline-block ml-2" />
                      </button>
                    </div>

                    {hasProof && (
                      <div className="mt-4">
                        <label
                          htmlFor="proof-upload"
                          className="block text-base font-medium text-gray-700 mb-2"
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
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        />
                        {proofFiles.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600">
                            Selected files:{" "}
                            <span className="font-semibold">
                              {proofFiles.map((file) => file.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Priority Selection */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      Set Priority:
                    </p>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPriority("High")}
                        className={`px-6 py-2 rounded-md font-semibold text-lg transition-all duration-200
                          ${priority === "High"
                            ? "bg-red-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                        `}
                      >
                        High
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority("Medium")}
                        className={`px-6 py-2 rounded-md font-semibold text-lg transition-all duration-200
                          ${priority === "Medium"
                            ? "bg-blue-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                        `}
                      >
                        Medium
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority("Low")}
                        className={`px-6 py-2 rounded-md font-semibold text-lg transition-all duration-200
                          ${priority === "Low"
                            ? "bg-gray-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                        `}
                      >
                        Low
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    >
                      Review & Submit <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold text-blue-700 mb-4">
                    Step 3: Review Your Complaint
                  </h2>

                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <p className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                      Complaint Details Summary:
                    </p>
                    <p className="text-lg">
                      <strong>Voice Message (Nepali):</strong>{" "}
                      <span className="text-gray-700">
                        {voiceMessage || "N/A"}
                      </span>
                    </p>
                    <p className="text-lg">
                      <strong>Converted Text (English):</strong>{" "}
                      <span className="text-gray-700">
                        {convertedText || "N/A"}
                      </span>
                    </p>
                    <p className="text-lg">
                      <strong>Location:</strong>{" "}
                      <span className="text-gray-700">
                        {locationData
                          ? `${
                              locationData.fullAddress
                            } (Lat: ${locationData.latitude.toFixed(
                              4
                            )}, Lon: ${locationData.longitude.toFixed(4)})`
                          : "N/A"}
                      </span>
                    </p>
                    <p className="text-lg">
                      <strong>Proof Attached:</strong>{" "}
                      <span className="text-gray-700">
                        {hasProof
                          ? proofFiles.length > 0
                            ? proofFiles.map((file) => file.name).join(", ")
                            : "Yes, but no files selected"
                          : "No"}
                      </span>
                    </p>
                    <p className="text-lg">
                      <strong>Priority:</strong>{" "}
                      <span className="font-bold text-red-700">
                        {priority}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                      onClick={handleSubmitComplaint}
                      className="px-8 py-3 bg-red-700 text-white font-bold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    >
                      Submit Complaint <FaPaperPlane className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CitizenPage;
