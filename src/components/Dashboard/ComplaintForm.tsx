import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, MapPin, Send, Bot } from "lucide-react";
import { classifyComplaint } from "../../utils/nlpClassifier";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  // Helper to fetch authority ID from Firestore based on category
  const fetchAuthorityId = async () => {
    // TODO: Add query logic for category/location if needed
    return "real-authority-id";
  };
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcription, setTranscription] = useState("");
  const [classification, setClassification] = useState<{
    category: string;
    priority: "low" | "medium" | "high";
    confidence: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    location: null as Location | null,
    uploads: [] as string[], // store file URLs
  });

  const handleFileUpload = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `complaints/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    });
    return Promise.all(uploadPromises);
  };

  // Submit complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Fetch authority ID
      const authorityId = await fetchAuthorityId();
      // Upload files
      const uploads = await handleFileUpload(formData.uploads as any);
      // Save complaint to Firestore
      await addDoc(collection(db, "complaints"), {
        ...formData,
        uploads,
        userId: currentUser?.uid,
        createdAt: serverTimestamp(),
        status: "Pending",
        authorityId,
      });
      setLoading(false);
      alert("Complaint submitted!");
      onClose();
    } catch (err) {
      setLoading(false);
      alert("Error submitting complaint!");
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const categories = [
    "Electricity",
    "Water Supply",
    "Road & Transportation",
    "Healthcare",
    "Education",
    "Waste Management",
    "Public Safety",
    "Other",
  ];

  // Initialize Google Maps
  useEffect(() => {
    if (step === 2 && mapRef.current && !mapInstanceRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 27.7172, lng: 85.324 }, // Kathmandu
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }],
          },
        ],
      });

      const marker = new google.maps.Marker({
        map,
        draggable: true,
        position: { lat: 27.7172, lng: 85.324 },
      });

      const geocoder = new google.maps.Geocoder();

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setFormData((prev) => ({
                ...prev,
                location: {
                  lat: position.lat(),
                  lng: position.lng(),
                  address: results[0].formatted_address,
                },
              }));
            }
          });
        }
      });

      mapInstanceRef.current = map;
    }
  }, [step]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
  // setAudioBlob(blob); // Not used
        setAudioUrl(URL.createObjectURL(blob));

        // Simulate speech-to-text conversion
        setTimeout(() => {
          setTranscription(
            "Gulmi ma 3 din dekhi batti chaina. Ghar ma sano bachha cha ra medical emergency ma problem huncha."
          );

          // Real NLP classification
          const result = classifyComplaint({
            title: transcription,
            description: transcription,
          });
          setClassification({
            category: result.category,
            priority: (['low', 'medium', 'high'].includes(result.priority.toLowerCase()) ? result.priority.toLowerCase() : 'medium') as 'low' | 'medium' | 'high',
            confidence: result.confidence / 100,
          });
        }, 2000);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {userProfile?.verified ? (
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#DC143C",
                  color: "white",
                  border: "2px solid #003893",
                }}
                aria-label="Submit Complaint"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Complaint
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 py-3 rounded-lg font-semibold text-center bg-gray-200 text-gray-600 border-2 border-gray-300">
                ID not verified. Please upload citizenship for verification to
                submit complaints.
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Voice Recording */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                {isRecording ? (
                  <div className="w-16 h-16 bg-red-600 rounded-full animate-pulse flex items-center justify-center">
                    <MicOff className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <Mic className="w-16 h-16 text-red-600" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isRecording ? "Recording..." : "Record Your Complaint"}
                </h3>
                <p className="text-gray-600">
                  Speak clearly in Nepali about your complaint. Our AI will
                  transcribe and categorize it.
                </p>
              </div>

              {audioUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio controls className="w-full mb-4">
                    <source src={audioUrl} type="audio/wav" />
                  </audio>

                  {transcription && (
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Transcription:
                      </h4>
                      <p className="text-gray-700 bg-white p-3 rounded border">
                        {transcription}
                      </p>
                    </div>
                  )}

                  {classification && (
                    <div className="mt-4 text-left">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        AI Classification:
                      </h4>
                      <div className="bg-white p-3 rounded border space-y-2">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Category:</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {classification.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-red-600" />
                          <span className="font-medium">Priority:</span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              classification.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : classification.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {classification.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Confidence:</span>
                          <span className="text-green-600">
                            {Math.round(classification.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </button>
                )}
              </div>

              {audioUrl && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Location
                </button>
              )}
            </div>
          )}

          {/* Step 2: Location Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select Location
                </h3>
                <p className="text-gray-600">
                  Drag the marker to your exact location
                </p>
              </div>

              <div
                ref={mapRef}
                className="w-full h-64 rounded-lg border border-gray-300"
              ></div>

              {formData.location && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Selected Location:
                      </p>
                      <p className="text-gray-700">
                        {formData.location.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.location}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Edit */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Review & Edit
                </h3>
                <p className="text-gray-600">
                  Review the details and make any necessary changes
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || classification?.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Brief title for your complaint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={transcription || formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Detailed description of your complaint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={classification?.category || formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={classification?.priority || formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Final Review
                </h3>
                <p className="text-gray-600">
                  Please review all details before submitting
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Title:</h4>
                  <p className="text-gray-700">
                    {formData.title || classification?.category}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Description:</h4>
                  <p className="text-gray-700">
                    {transcription || formData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Category:</h4>
                    <p className="text-gray-700">
                      {classification?.category || formData.category}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Priority:</h4>
                    <p className="text-gray-700 capitalize">
                      {classification?.priority || formData.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Location:</h4>
                  <p className="text-gray-700">{formData.location?.address}</p>
                </div>

                {audioUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Voice Recording:
                    </h4>
                    <audio controls className="w-full mt-2">
                      <source src={audioUrl} type="audio/wav" />
                    </audio>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#DC143C",
                    color: "white",
                    border: "2px solid #003893",
                  }}
                  aria-label="Submit Complaint"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ComplaintForm;
