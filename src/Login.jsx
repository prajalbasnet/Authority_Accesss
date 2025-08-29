import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import backgroundImage from "./assets/nepaliimage2.jpg";
import nepalFlag from "./assets/HamroGunaso.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      toast.info("You are already logged in.");
      if (user.role === "AUTHORITY") {
        navigate("/authority/dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin"); // Redirect to admin dashboard home
      } else if (user.role === "USER") {
        navigate("/citizen");
      } else {
        navigate("/"); // Default or error page
      }
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_BASE_URL || "";
      const response = await axios.post(
        `${API}/api/auth/login`,
        data
      );

      if (response.data.success) {
        const { token, user, location } = response.data.data;

        // Store token, user, and location in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (location) {
          localStorage.setItem("location", JSON.stringify(location));
        }

        toast.success("Login Successful! Redirecting...");

        if (user.role === "AUTHORITY") {
          navigate("/authority/dashboard");
        } else if (user.role === "ADMIN") {
          navigate("/admin"); // Redirect to admin dashboard home
        } else if (user.role === "USER") {
          navigate("/citizen");
        } else {
          navigate("/"); // Default or error page
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children }) => (
    <label className="block font-semibold text-gray-700 text-sm mb-1.5">
      {children}
    </label>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center font-poppins"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={nepalFlag}
            alt="Nepal Flag"
            className="w-24 h-24 mb-0 object-contain"
          />
          <h1 className="text-3xl font-bold font-poppins text-blue-900">
            Welcome Back
          </h1>
          <p className="text-gray-900 text-sm mt-1">
            Please Login to continue!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label>Email Address</Label>
            <input
              type="email"
              {...register("email")}
              placeholder="e.g., user@example.com"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label>Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="w-full p-2.5 bg-white pr-10 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-red-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center text-base shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging
                  In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600 hover:underline hover:text-red-500 transition-all duration-300"
          >
            Register now
          </Link>
        </p>
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

export default Login;
