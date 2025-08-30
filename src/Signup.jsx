import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import Webcam from "react-webcam";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import backgroundImage from "./assets/nepaliimage2.jpg";
import MapPicker from "./components/MapPicker";
import { authService } from "./services/apiService";

// ================== VALIDATION SCHEMAS ==================

const baseSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullAddress: z.string().min(1, "Address is required."),
  latitude: z.number({ invalid_type_error: "Latitude is required." }),
  longitude: z.number({ invalid_type_error: "Longitude is required." }),
});

const authoritySchema = baseSchema.extend({
  authorityType: z.string().min(1, "Authority type is required."),
  phoneNumber: z.string().min(5, "Phone number is required."),
  profilePhoto: z
    .any()
    .refine((files) => files?.length === 1, "Profile photo is required."),
  citizenshipFrontImage: z
    .any()
    .refine((files) => files?.length === 1, "Front side is required."),
  citizenshipBackImage: z
    .any()
    .refine((files) => files?.length === 1, "Back side is required."),
  authorityIdentityCardImage: z
    .any()
    .refine((files) => files?.length === 1, "Identity card is required."),
  // fullAddress, latitude, longitude will be set via map picker, not manual
});

// ================== COMPONENT ==================
const Signup = () => {
  const [role, setRole] = useState("citizen"); // citizen | authority
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null, fullAddress: "" });
  const schema = role === "citizen" ? baseSchema : authoritySchema;
  const navigate = useNavigate();

  // Photo capture state
  const [userPhoto, setUserPhoto] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState({
    authorityIdCard: null,
    citizenshipFront: null,
    citizenshipBack: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues:
      JSON.parse(localStorage.getItem(`signup-form-${role}`)) || {},
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      // If admin, allow to stay and logout (do not redirect)
      if (user.role === "ADMIN") {
        toast.info("You are logged in as admin. Please logout to register a new user.");
        return;
      }
      // If citizen or authority, redirect as before
      toast.info("You are already logged in.");
      if (user.role === "AUTHORITY") {
        navigate("/authority/dashboard");
      } else {
        navigate("/citizen");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`signup-form-${role}`)) || {};
    reset(saved);
    setUserPhoto(null);
    setLivePhoto(null);
    setIsCameraOpen(false);
    setLocation({ latitude: null, longitude: null, fullAddress: "" });
  }, [role, reset]);

  // Save form data to localStorage on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(`signup-form-${role}`, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, role]);

  // Sync location state to form fields
  useEffect(() => {
    setValue("latitude", location.latitude || "");
    setValue("longitude", location.longitude || "");
    setValue("fullAddress", location.fullAddress || "");
  }, [location, setValue]);

  // ================== PHOTO CAPTURE LOGIC ==================
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
    const blob = dataURLtoBlob(livePhoto);
    const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setValue("profilePhoto", dataTransfer.files, { shouldValidate: true });
    toast.success("Photo captured successfully!");
    setIsCameraOpen(false);
  };

  const openCamera = () => {
    setLivePhoto(null); // Reset any previous captures in modal
    setIsCameraOpen(true);
  };

  // ================== SUBMIT ==================
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (role === "citizen") {
        // Use location state for lat/lng/address
        const payload = {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          fullAddress: location.fullAddress,
          latitude: location.latitude,
          longitude: location.longitude,
        };
        
        const result = await authService.registerCitizen(payload);

        if (result.success) {
          toast.success("Registered successfully! Now verify your OTP.");
          localStorage.removeItem("signup-form-citizen");
          sessionStorage.setItem("otp-email", data.email);
          sessionStorage.setItem("otp-role", role);
          navigate("/otp", { state: { email: data.email, role: "citizen" } });
        } else {
          toast.error(result.message || "Registration failed.");
        }
      } else {
        // Use location state for lat/lng/address
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'profilePhoto' || key === 'citizenshipFrontImage' || 
              key === 'citizenshipBackImage' || key === 'authorityIdentityCardImage') {
            // For file inputs, append the actual file
            if (value?.[0]) {
              formData.append(key, value[0]);
            }
          } else {
            // For text inputs, append the value directly
            if (value !== undefined && value !== null && value !== '') {
              formData.append(key, value);
            }
          }
        });
        formData.append("latitude", location.latitude || 0);
        formData.append("longitude", location.longitude || 0);
        formData.append("fullAddress", location.fullAddress || "");

        // Debug: Log FormData contents
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(key, ':', value);
        }

        // Additional validation check
        console.log("Location data:", location);
        console.log("Form data:", data);

        const result = await authService.registerAuthority(formData);

        if (result.success) {
          toast.success(
            "Registration successful! Your application is under review."
          );
          localStorage.removeItem("signup-form-authority");
          sessionStorage.setItem("otp-email", data.email);
          sessionStorage.setItem("otp-role", role);
          reset();
          navigate("/otp", { state: { email: data.email, role: "authority" } });
        } else {
          toast.error(result.message || "Registration failed.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Signup failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTab = "bg-red-600 text-white";
  const inactiveTab = "bg-white/50 text-gray-700";

  const Label = ({ label, required }) => (
    <label className="block font-semibold text-gray-700 text-xs mb-1">
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

  const CustomFileInput = ({
    label,
    required,
    fileName,
    onChange,
    error,
    id,
  }) => (
    <div>
      <Label label={label} required={required} />
      <div className="flex items-center">
        <label
          htmlFor={id}
          className="mr-2 py-1.5 px-4 rounded-lg border-0 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 flex items-center cursor-pointer"
        >
          <FaCamera className="mr-2" />
          {fileName ? "Change Photo" : "Choose Photo"}
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
        />
        {fileName && (
          <span className="text-green-600 text-xs ml-2">{fileName}</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-0 bg-filled bg-center  bg-no-repeat font-poppins"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="fixed inset-0  bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`relative w-full ${role === "authority" ? "max-w-lg" : "max-w-md"
            } bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300`}
        >
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-blue-900">
              Create an Account
            </h1>
            <p className="text-gray-900 text-sm mt-1 font-poppins">
              Let's get you started!
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 p-1 bg-gray-100/50">
              <button
                onClick={() => setRole("citizen")}
                className={`px-8 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${role === "citizen" ? activeTab : inactiveTab
                  }`}
              >
                Citizen
              </button>
              <button
                onClick={() => setRole("authority")}
                className={`px-8 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${role === "authority" ? activeTab : inactiveTab
                  }`}
              >
                Authority
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-1.5"
            encType="multipart/form-data"
          >

            {/* ========= BASE FIELDS ========= */}
            <div>
              <Label label={role === "authority" ? "Authority Office Name" : "Full Name"} required />
              <input
                type="text"
                {...register("fullName")}
                placeholder={role === "authority" ? "e.g., District Electricity Office" : "e.g., Ram Bahadur Thapa"}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.fullName.message}
                </p>
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ========= LOCATION PICKER FOR CITIZEN ========= */}
            {role === "citizen" && (
              <div>
                <Label label="Location" required />
                <button
                  type="button"
                  className="w-full p-2.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 font-semibold hover:bg-blue-100 transition mb-2"
                  onClick={() => setShowMap(true)}
                >
                  {location.latitude && location.longitude
                    ? `Selected: ${location.fullAddress || `Lat: ${location.latitude}, Lng: ${location.longitude}`}`
                    : "Choose on map"}
                </button>
                {/* Hidden fields for validation */}
                <input type="hidden" {...register("latitude", { valueAsNumber: true })} value={location.latitude || ""} />
                <input type="hidden" {...register("longitude", { valueAsNumber: true })} value={location.longitude || ""} />
                <input type="hidden" {...register("fullAddress")} value={location.fullAddress || ""} />
                {(errors.latitude || errors.longitude || errors.fullAddress) && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.fullAddress?.message || errors.latitude?.message || errors.longitude?.message}
                  </p>
                )}
              </div>
            )}
            {/* Map Picker Modal */}
            {showMap && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 relative"
                >
                  <h3 className="text-xl font-bold text-center mb-4">Select Location on Map</h3>
                  <MapPicker
                    onLocationSelect={(loc) => {
                      setLocation(loc);
                      setShowMap(false);
                    }}
                    initialPosition={location.latitude && location.longitude ? [location.latitude, location.longitude] : [27.6193, 83.4750]}
                    autoCloseOnSelect
                  />
                  <button
                    onClick={() => setShowMap(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    &times;
                  </button>
                </motion.div>
              </div>
            )}

            {/* ========= AUTHORITY FIELDS ========= */}
            {role === "authority" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-1 pt-1 pb-0 mt-1 mb-0 border-t border-gray-300/50 overflow-hidden bg-white/90 rounded-xl px-1"
              >
                <div>
                  <Label label="Authority Type" required />
                  <select
                    {...register("authorityType")}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition bg-white"
                  >
                    <option value="">Select Authority Type</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="ROAD">Road</option>
                    <option value="WATER">Water</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="CYBERBUREAU">Cyber Bureau</option>
                    <option value="FIRE">Fire</option>
                    <option value="POLICE">Police</option>
                  </select>
                  {errors.authorityType && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.authorityType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label label="Phone Number" required />
                  <input
                    type="text"
                    {...register("phoneNumber")}
                    placeholder="e.g., 9800000000"
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200/50 outline-none text-sm transition"
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Map Picker for Address/Lat/Lng */}
                <div>
                  <Label label="Office Location" required />
                  <button
                    type="button"
                    className="w-full p-2.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 font-semibold hover:bg-blue-100 transition mb-2"
                    onClick={() => setShowMap(true)}
                  >
                    {location.latitude && location.longitude
                      ? `Selected: ${location.fullAddress || `Lat: ${location.latitude}, Lng: ${location.longitude}`}`
                      : "Choose on map"}
                  </button>
                  {/* Hidden fields for validation */}
                  <input type="hidden" {...register("latitude", { valueAsNumber: true })} value={location.latitude || ""} />
                  <input type="hidden" {...register("longitude", { valueAsNumber: true })} value={location.longitude || ""} />
                  <input type="hidden" {...register("fullAddress")} value={location.fullAddress || ""} />
                  {(errors.latitude || errors.longitude || errors.fullAddress) && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.fullAddress?.message || errors.latitude?.message || errors.longitude?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Photo */}
                  <div>
                    <Label label="Profile Photo" required />
                    <div className="w-full text-xs text-gray-700 border border-gray-300 rounded-lg p-1 bg-white flex items-center h-[35.5px]">
                      {userPhoto ? (
                        <>
                          <button
                            type="button"
                            onClick={openCamera}
                            className="mr-3 py-1.5 px-4 rounded-lg border-0 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            Change Photo
                          </button>
                          <span className="text-gray-700">
                            profile-photo.jpg
                          </span>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={openCamera}
                          className="w-full h-full py-1.5 px-4 rounded-lg border-0 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center"
                        >
                          <FaCamera className="mr-2" /> Capture Photo
                        </button>
                      )}
                    </div>
                    {errors.profilePhoto && !userPhoto && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.profilePhoto.message}
                      </p>
                    )}
                  </div>

                  {/* Authority ID Card */}
                  <div>
                    <CustomFileInput
                      label="Authority ID Card"
                      required
                      id="authorityIdCard"
                      fileName={selectedFiles.authorityIdCard}
                      onChange={(e) => {
                        setSelectedFiles((prev) => ({
                          ...prev,
                          authorityIdCard: e.target.files[0]?.name || null,
                        }));
                        setValue("authorityIdentityCardImage", e.target.files, { shouldValidate: true });
                      }}
                      error={errors.authorityIdentityCardImage}
                    />
                  </div>

                  {/* Citizenship (Front) */}
                  <div>
                    <CustomFileInput
                      label="Citizenship (Front)"
                      required
                      id="citizenshipFront"
                      fileName={selectedFiles.citizenshipFront}
                      onChange={(e) => {
                        setSelectedFiles((prev) => ({
                          ...prev,
                          citizenshipFront: e.target.files[0]?.name || null,
                        }));
                        setValue("citizenshipFrontImage", e.target.files, { shouldValidate: true });
                      }}
                      error={errors.citizenshipFrontImage}
                    />
                  </div>

                  {/* Citizenship (Back) */}
                  <div>
                    <CustomFileInput
                      label="Citizenship (Back)"
                      required
                      id="citizenshipBack"
                      fileName={selectedFiles.citizenshipBack}
                      onChange={(e) => {
                        setSelectedFiles((prev) => ({
                          ...prev,
                          citizenshipBack: e.target.files[0]?.name || null,
                        }));
                        setValue("citizenshipBackImage", e.target.files, { shouldValidate: true });
                      }}
                      error={errors.citizenshipBackImage}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center text-base shadow-lg ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Registering...
                  </>
                ) : (
                  `Register as ${role === "citizen" ? "Citizen" : "Authority"}`
                )}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:underline hover:text-red-500 transition-all duration-300"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 relative"
          >
            <h3 className="text-xl font-bold text-center mb-4">
              Capture Profile Photo
            </h3>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              {livePhoto ? (
                <img
                  src={livePhoto}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
            <button
              onClick={() => setIsCameraOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </motion.div>
        </div>
      )}

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
    </>
  );
};

export default Signup;
