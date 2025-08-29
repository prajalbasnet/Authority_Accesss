import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read from sessionStorage first, then location.state
  const initialEmail =
    sessionStorage.getItem("otp-email") || location.state?.email;
  const initialRole =
    sessionStorage.getItem("otp-role") || location.state?.role;

  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole);

  const [otp, setOtp] = useState(() => {
    const savedOtp = sessionStorage.getItem("otp-digits");
    return savedOtp ? JSON.parse(savedOtp) : ["", "", "", "", "", ""];
  });
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Redirect if email is not present (e.g., direct access)
  useEffect(() => {
    if (!email) {
      toast.error("Email not provided. Please register again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Save OTP digits to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("otp-digits", JSON.stringify(otp));
  }, [otp]);

  // countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // handle input
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // verify OTP
  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      try {
        const API = import.meta.env.VITE_API_BASE_URL || "";
        const response = await fetch(
          `${API}/api/otp/verify/VERIFY_EMAIL`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: fullOtp }),
          }
        );

        const result = await response.json();
        if (response.ok && result.success) {
          toast.success("✅ OTP Verified!");
          // Clear sessionStorage on successful verification
          sessionStorage.removeItem("otp-email");
          sessionStorage.removeItem("otp-role");
          sessionStorage.removeItem("otp-digits");

          // role अनुसार next step
          if (role === "citizen") {
            toast.info("Now login with your email & password.");
            navigate("/login", { state: { showMessage: true } });
          } else if (role === "authority") {
            navigate("/verification-authority");
          } else {
            navigate("/login");
          }
        } else {
          toast.error(result.message || "❌ Invalid OTP. Try again.");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        toast.error("⚠️ OTP Error. Try again later.");
      }
    } else {
      toast.warning("⚠️ Please enter full 6-digit OTP.");
    }
  };

  // resend OTP
  const handleResend = async () => {
    try {
      const API = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(
        `${API}/api/otp/send/VERIFY_EMAIL`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        setOtp(["", "", "", "", "", ""]);
        toast.success("✅ OTP resent to your email!");
        setTimer(30);
        setCanResend(false);
        sessionStorage.removeItem("otp-digits"); // Clear OTP on resend
      } else {
        toast.error(result.message || "❌ Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("⚠️ Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border-4 border-blue-700">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Email Verification
        </h2>

        {email && (
          <p className="text-sm text-center text-gray-600 mb-4">
            OTP has been sent to: <strong>{email}</strong>
          </p>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength={1}
              className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-red-600 transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all"
        >
          Verify OTP
        </button>

        {/* Resend Section */}
        <div className="mt-4 text-center text-sm text-gray-700">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-red-600 underline hover:text-blue-700 transition"
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend OTP in {timer}s</span>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Otp;
