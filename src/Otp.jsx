import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      toast.error("Email not found. Please register again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/otp/verify/registration",
        { email, otp }
      );

      if (response.status === 200) {
        toast.success("Otp verified Now login with your email and password");
        navigate("/login");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "OTP verification failed.");
      } else {
        toast.error("Server not responding. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Verify Your Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          An OTP has been sent to <strong>{email}</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="mx-2 text-gray-400">-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle="w-12 h-12 text-2xl rounded-lg border-2 border-gray-300 text-center focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300"
              containerStyle="gap-2"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || otp.length < 6}
            className={`w-full font-bold py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center text-base ${
              isSubmitting || otp.length < 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-lg hover:-translate-y-1"
            }`}
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Otp;