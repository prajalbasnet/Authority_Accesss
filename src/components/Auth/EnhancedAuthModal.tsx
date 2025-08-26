import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Upload,
  // ...existing code...
  Trash2,
  Building,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  userType?: "citizen" | "authority";
}

interface FileUpload {
  file: File | null;
  preview: string | null;
  name: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  userType = "citizen",
}) => {
  const isAdmin = false; // Set to true if you want to enable admin login logic
  // Only citizen and authority are valid userType, so admin logic should be handled elsewhere or by a prop.
  const [mode, setMode] = useState<"login" | "signup">(
    isAdmin ? "login" : initialMode
  );
  const [formData, setFormData] = useState({
    email: isAdmin ? "admin" : "",
    password: isAdmin ? "admin" : "",
    name: "",
    phone: "",
    location: "",
    authorityField: "",
    authorityLocation: "",
  });
  const [files, setFiles] = useState({
    citizenshipFront: {
      file: null,
      preview: null,
      name: "Citizenship Front",
    } as FileUpload,
    citizenshipBack: {
      file: null,
      preview: null,
      name: "Citizenship Back",
    } as FileUpload,
    passportPhoto: {
      file: null,
      preview: null,
      name: "Passport Photo",
    } as FileUpload,
    authorityId: {
      file: null,
      preview: null,
      name: "Authority ID",
    } as FileUpload,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleFileChange = (
    field: keyof typeof files,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const preview = URL.createObjectURL(file);
      setFiles((prev) => ({
        ...prev,
        [field]: { file, preview, name: prev[field].name },
      }));
    }
  };

  const removeFile = (field: keyof typeof files) => {
    if (files[field].preview) {
      URL.revokeObjectURL(files[field].preview!);
    }
    setFiles((prev) => ({
      ...prev,
      [field]: { file: null, preview: null, name: prev[field].name },
    }));
  };

  const validateFiles = () => {
    if (userType === "citizen") {
      if (
        !files.citizenshipFront.file ||
        !files.citizenshipBack.file ||
        !files.passportPhoto.file
      ) {
        setError("Please upload all required documents");
        return false;
      }
    } else if (userType === "authority") {
      if (!files.authorityId.file) {
        setError("Please upload your authority ID card");
        return false;
      }
      if (!formData.authorityField || !formData.authorityLocation) {
        setError("Please fill all authority information");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup" && !validateFiles()) {
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.name,
          userType
        );
        // Here you would handle file uploads to Firebase Storage
        // and store the file URLs in Firestore
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError("");

    try {
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const FileUploadField = ({
    field,
    label,
    required = true,
  }: {
    field: keyof typeof files;
    label: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      {!files[field].file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-300 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload {label.toLowerCase()}
          </p>
          <input
            type="file"
            accept="image/*"
            required={required}
            onChange={(e) => handleFileChange(field, e)}
            className="hidden"
            id={`file-upload-${field}`}
          />
          <label
            htmlFor={`file-upload-${field}`}
            className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Choose File
          </label>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {files[field].preview && (
              <img
                src={files[field].preview}
                alt={label}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {files[field].file?.name}
              </p>
              <p className="text-xs text-gray-500">
                {(files[field].file?.size || 0) / 1024} KB
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => removeFile(field)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">
              {mode === "login" ? "Welcome Back" : "Join SunneAawaj"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Type Badge */}
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                userType === "citizen"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userType === "citizen"
                ? "👤 Citizen Account"
                : "🏛️ Authority Account"}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <button
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <div className="w-5 h-5 bg-white rounded text-blue-600 flex items-center justify-center text-xs font-bold">
                f
              </div>
              Continue with Facebook
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && !isAdmin && (
              <>
                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      aria-label="Full Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                      aria-label="Phone Number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your location"
                      aria-label="Location"
                    />
                  </div>
                </div>

                {/* Citizen-specific uploads */}
                {userType === "citizen" && (
                  <>
                    <FileUploadField
                      field="citizenshipFront"
                      label="Citizenship Card (Front)"
                    />
                    <FileUploadField
                      field="citizenshipBack"
                      label="Citizenship Card (Back)"
                    />
                    <FileUploadField
                      field="passportPhoto"
                      label="Recent Passport Size Photo"
                    />
                  </>
                )}

                {/* Authority-specific uploads and selections */}
                {userType === "authority" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authority Field *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          required
                          value={formData.authorityField}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              authorityField: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                          aria-label="Authority Field"
                        >
                          <option value="">Select field</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Water Supply">Water Supply</option>
                          <option value="Road & Transportation">
                            Road & Transportation
                          </option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Waste Management">
                            Waste Management
                          </option>
                          <option value="Public Safety">Public Safety</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authority Location *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.authorityLocation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              authorityLocation: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter office location"
                          aria-label="Authority Location"
                        />
                      </div>
                    </div>
                    <FileUploadField
                      field="authorityId"
                      label="Office ID Card"
                    />
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={
                    isAdmin
                      ? undefined
                      : (e) =>
                          setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={isAdmin ? "admin" : "Enter your email"}
                  disabled={isAdmin}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={
                    isAdmin
                      ? undefined
                      : (e) =>
                          setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={isAdmin ? "admin" : "Enter your password"}
                  disabled={isAdmin}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Toggle Mode */}
          {/* Hide signup toggle for admin */}
          {!isAdmin && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
