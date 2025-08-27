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

// ================== VALIDATION SCHEMAS ==================
const baseSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const authoritySchema = baseSchema.extend({
  authorityType: z.string().min(1, "Authority type is required."),
  profilePhoto: z
    .any()
    .refine((file) => file?.length === 1, "Profile photo is required."),
  citizenshipFrontImage: z
    .any()
    .refine((file) => file?.length === 1, "Front side is required."),
  citizenshipBackImage: z
    .any()
    .refine((file) => file?.length === 1, "Back side is required."),
  authorityIdentityCardImage: z
    .any()
    .refine((file) => file?.length === 1, "Identity card is required."),
});

// ================== COMPONENT ==================
const Signup = () => {
  const [role, setRole] = useState("citizen"); // citizen | authority
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = role === "citizen" ? baseSchema : authoritySchema;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    reset();
  }, [role, reset]);

  // ================== SUBMIT ==================
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (role === "citizen") {
        const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          {
            fullName: data.fullName,
            email: data.email,
            password: data.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          toast.success("Registered successfully! Now verify your OTP.");
          navigate("/otp", { state: { email: data.email, role: "citizen" } });
        }
      } else {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (
            [
              "profilePhoto",
              "citizenshipFrontImage",
              "citizenshipBackImage",
              "authorityIdentityCardImage",
            ].includes(key)
          ) {
            if (value?.[0]) {
              formData.append(key, value[0]);
            }
          } else {
            formData.append(key, value);
          }
        });

        const response = await axios.post(
          "http://localhost:8080/api/auth/authority/register",
          formData
        );

        if (response.status === 200) {
          toast.success(
            "Registration successful! Your application is under review."
          );
          reset();
          navigate("/authority-verification-message");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTab = "bg-red-600 text-white";
  const inactiveTab = "bg-white/50 text-gray-700";

  const Label = ({ label, required }) => (
    <label className="block font-semibold text-gray-700 text-xs">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const FileInput = React.forwardRef((props, ref) => (
    <input
      type="file"
      ref={ref}
      {...props}
      className="w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-gray-300 rounded-lg p-1 bg-white transition focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
    />
  ));

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 bg-cover bg-center font-poppins"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative w-full ${role === 'authority' ? 'max-w-lg' : 'max-w-md'} bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300`}
      >
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Create an Account</h1>
            <p className="text-gray-900 text-sm mt-1 font-poppins">Let's get you started!</p>
        </div>
        <div className="flex justify-center">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 p-1 bg-gray-100/50">
            <button
              onClick={() => setRole("citizen")}
              className={`px-6 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                role === "citizen" ? activeTab : inactiveTab
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => setRole("authority")}
              className={`px-6 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                role === "authority" ? activeTab : inactiveTab
              }`}
            >
              Authority
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
          encType="multipart/form-data"
        >
          {/* ========= BASE FIELDS ========= */}
          <div>
            <Label label="Full Name" required />
            <input
              type="text"
              {...register("fullName")}
              placeholder="e.g., Ram Bahadur Thapa"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label label="Email Address" required />
            <input
              type="email"
              {...register("email")}
              placeholder="e.g., user@example.com"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label label="Password" required />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Must be at least 8 characters"
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
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* ========= AUTHORITY FIELDS ========= */}
          {role === "authority" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{duration: 0.4, ease: 'easeInOut'}} className="space-y-3 pt-3 border-t border-gray-300/50 overflow-hidden">
              <div>
                <Label label="Authority Type" required />
                <select
                  {...register("authorityType")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition bg-white"
                >
                  <option value="">Select Authority Type</option>
                  <option value="electricity">Electricity</option>
                  <option value="transport">Transport</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="water">Water</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="road">Road</option>
                </select>
                {errors.authorityType && (
                  <p className="text-xs text-red-600 mt-1">{errors.authorityType.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label label="Profile Photo" required />
                  <FileInput {...register("profilePhoto")} accept="image/*" />
                  {errors.profilePhoto && (
                    <p className="text-xs text-red-600 mt-1">{errors.profilePhoto.message}</p>
                  )}
                </div>
                <div>
                  <Label label="Authority ID Card" required />
                  <FileInput {...register("authorityIdentityCardImage")} accept="image/*" />
                  {errors.authorityIdentityCardImage && (
                    <p className="text-xs text-red-600 mt-1">{errors.authorityIdentityCardImage.message}</p>
                  )}
                </div>
                <div>
                  <Label label="Citizenship (Front)" required />
                  <FileInput {...register("citizenshipFrontImage")} accept="image/*" />
                  {errors.citizenshipFrontImage && (
                    <p className="text-xs text-red-600 mt-1">{errors.citizenshipFrontImage.message}</p>
                  )}
                </div>
                <div>
                  <Label label="Citizenship (Back)" required />
                  <FileInput {...register("citizenshipBackImage")} accept="image/*" />
                  {errors.citizenshipBackImage && (
                    <p className="text-xs text-red-600 mt-1">{errors.citizenshipBackImage.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

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
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...</>
              ) : (
                `Register as ${role === "citizen" ? "Citizen" : "Authority"}`
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline hover:text-red-500 transition-all duration-300">
            Login
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

export default Signup;