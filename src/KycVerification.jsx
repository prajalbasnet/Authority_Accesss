import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CitizenNavbar from './components/CitizenNavbar';
import Webcam from 'react-webcam';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';

const KycVerification = () => {
  // State for form fields
  const [phonenumber, setPhonenumber] = useState("");
  const [userPhoto, setUserPhoto] = useState(() => {
    const saved = sessionStorage.getItem('kyc-form-userPhoto');
    return saved ? JSON.parse(saved) : null;
  });
  const [frontImage, setFrontImage] = useState(() => {
    const saved = sessionStorage.getItem('kyc-form-frontImage');
    return saved ? JSON.parse(saved) : null;
  });
  const [backImage, setBackImage] = useState(() => {
    const saved = sessionStorage.getItem('kyc-form-backImage');
    return saved ? JSON.parse(saved) : null;
  });

  // State for camera modal
  const [livePhoto, setLivePhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Save form data to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('kyc-form-userPhoto', JSON.stringify(userPhoto));
  }, [userPhoto]);

  useEffect(() => {
    sessionStorage.setItem('kyc-form-frontImage', JSON.stringify(frontImage));
  }, [frontImage]);

  useEffect(() => {
    sessionStorage.setItem('kyc-form-backImage', JSON.stringify(backImage));
  }, [backImage]);

  const handleFileChange = (setter) => (event) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
      toast.success(`${event.target.files[0].name} selected.`);
    }
  };

  const captureUserPhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setLivePhoto(imageSrc);
  }, [webcamRef]);

  const handleRetakePhoto = () => {
    setLivePhoto(null);
  };

  const handleDone = () => {
    setUserPhoto(livePhoto);
    toast.success('Photo captured successfully!');
    setIsCameraOpen(false);
  };

  const openCamera = () => {
    setLivePhoto(null);
    setIsCameraOpen(true);
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userPhoto || !frontImage || !backImage) {
      toast.error("Please capture your photo and upload both sides of your citizenship.");
      setIsSubmitting(false);
      return;
    }

  const formData = new FormData();
  formData.append('phonenumber', phonenumber);
  formData.append('userPhoto', dataURLtoBlob(userPhoto), 'user-photo.jpg');
  formData.append('frontImage', frontImage);
  formData.append('backImage', backImage);

    try {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const response = await axios.post(`${API}/api/users/kyc`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        // Update user status in localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.status = 'PENDING'; // Assuming status becomes PENDING after submission
          localStorage.setItem('user', JSON.stringify(user));
        }
        toast.success("KYC submitted successfully!");
        sessionStorage.removeItem('kyc-form-userPhoto');
        sessionStorage.removeItem('kyc-form-frontImage');
        sessionStorage.removeItem('kyc-form-backImage');
        navigate('/citizen');
      } else {
        toast.error(response.data.message || "KYC submission failed.");
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("KYC submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-poppins">
       
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-extrabold text-red-700 mb-8 text-center">KYC Verification</h1>
          <p className="text-lg text-gray-700 mb-10 text-center">Please complete your KYC to enable complaint filing. All fields are required.</p>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Photo:</label>
                <div className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-1.5 bg-white flex items-center h-[42px]">
                    {userPhoto ? (
                    <>
                        <button 
                        type="button" 
                        onClick={openCamera}
                        className="mr-3 py-1.5 px-4 rounded-lg border-0 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                        Change Photo
                        </button>
                        <span className="text-gray-700">user-photo.jpg</span>
                    </>
                    ) : (
                    <button 
                        type="button" 
                        onClick={openCamera}
                        className="w-full h-full py-1.5 px-4 rounded-lg border-0 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center"
                    >
                        <FaCamera className="mr-2" /> Open Camera
                    </button>
                    )}
                </div>
              </div>

              <div>
                <label htmlFor="frontImage" className="block text-sm font-medium text-gray-700 mb-2">Citizenship Photo (Front):</label>
                <input
                  type="file"
                  id="frontImage"
                  accept="image/*"
                  onChange={handleFileChange(setFrontImage)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                {frontImage && <p className="mt-2 text-sm text-gray-600">Selected: {frontImage.name}</p>}
              </div>

              <div>
                <label htmlFor="backImage" className="block text-sm font-medium text-gray-700 mb-2">Citizenship Photo (Back):</label>
                <input
                  type="file"
                  id="backImage"
                  accept="image/*"
                  onChange={handleFileChange(setBackImage)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                {backImage && <p className="mt-2 text-sm text-gray-600">Selected: {backImage.name}</p>}
              </div>

              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
                <input
                  type="text"
                  id="phonenumber"
                  value={phonenumber}
                  onChange={e => setPhonenumber(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{scale: 0.7, opacity: 0}} 
            animate={{scale: 1, opacity: 1}} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 relative"
          >
            <h3 className="text-xl font-bold text-center mb-4">Capture Your Photo</h3>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              {livePhoto ? (
                <img src={livePhoto} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full"
                  videoConstraints={{ facingMode: "user" }}
                />
              )}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {!livePhoto ? (
                <button
                  type="button"
                  onClick={captureUserPhoto}
                  className="p-4 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
                  aria-label="Capture photo"
                >
                  <FaCamera size={24} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="px-6 py-2 text-base bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800"
                  >
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={handleDone}
                    className="px-6 py-2 text-base bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
            <button onClick={() => setIsCameraOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default KycVerification;