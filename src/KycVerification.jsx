import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CitizenNavbar from './components/CitizenNavbar';

const KycVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (setter) => (event) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
      toast.success(`${event.target.files[0].name} selected.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!phoneNumber || !userPhoto || !citizenshipFront || !citizenshipBack) {
      toast.error("Please fill in all required fields and upload all photos.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('userPhoto', userPhoto);
    formData.append('citizenshipFront', citizenshipFront);
    formData.append('citizenshipBack', citizenshipBack);

    // Simulate API call
    try {
      // In a real application, you would send formData to your backend
      // const response = await axios.post('/api/kyc-verify', formData);
      // if (response.data.success) {
      //   toast.success("KYC submitted successfully!");
      //   // Update local storage or context for KYC status
      //   localStorage.setItem('isKycVerified', 'pending'); // Or 'true' if instant verification
      //   navigate('/citizen'); // Redirect back to citizen dashboard
      // } else {
      //   toast.error(response.data.message);
      // }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      toast.success("KYC details submitted successfully!");
      localStorage.setItem('isKycVerified', 'pending'); // Set status to pending
      navigate('/citizen'); // Redirect back to citizen dashboard

    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("KYC submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <CitizenNavbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-red-700 mb-8 text-center">KYC Verification</h1>
        <p className="text-lg text-gray-700 mb-10 text-center">Please complete your KYC to enable complaint filing. All fields are required.</p>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 98XXXXXXXX"
                required
              />
            </div>

            <div>
              <label htmlFor="userPhoto" className="block text-sm font-medium text-gray-700 mb-2">Your Photo:</label>
              <input
                type="file"
                id="userPhoto"
                accept="image/*"
                onChange={handleFileChange(setUserPhoto)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {userPhoto && <p className="mt-2 text-sm text-gray-600">Selected: {userPhoto.name}</p>}
            </div>

            <div>
              <label htmlFor="citizenshipFront" className="block text-sm font-medium text-gray-700 mb-2">Citizenship Photo (Front):</label>
              <input
                type="file"
                id="citizenshipFront"
                accept="image/*"
                onChange={handleFileChange(setCitizenshipFront)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {citizenshipFront && <p className="mt-2 text-sm text-gray-600">Selected: {citizenshipFront.name}</p>}
            </div>

            <div>
              <label htmlFor="citizenshipBack" className="block text-sm font-medium text-gray-700 mb-2">Citizenship Photo (Back):</label>
              <input
                type="file"
                id="citizenshipBack"
                accept="image/*"
                onChange={handleFileChange(setCitizenshipBack)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {citizenshipBack && <p className="mt-2 text-sm text-gray-600">Selected: {citizenshipBack.name}</p>}
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
  );
};

export default KycVerification;
