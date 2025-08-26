import React, { useState, useEffect } from "react";
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
  initialMode?: "login" | "signup" | "admin" | "choose";
  userType?: "citizen" | "authority" | "admin" | null;
}

interface FileUpload {
  file: File | null;
  preview: string | null;
  name: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode: initialModeProp = "choose",
  userType: userTypeProp = null,
}) => {
  const [mode, setMode] = useState<"choose" | "login" | "signup" | "admin">(initialModeProp);
  const [selectedType, setSelectedType] = useState<"citizen" | "authority" | "admin" | null>(userTypeProp);

  useEffect(() => {
    if (isOpen) {
      setMode(initialModeProp);
      setSelectedType(userTypeProp);
    } else {
      // Reset state when modal closes
      setTimeout(() => {
        setMode("choose");
        setSelectedType(null);
        // Reset form data and error when modal closes
        // This is important to clear previous input/errors when reopening
        setFormData({
            email: "",
            password: "",
            name: "",
            phone: "",
            location: "",
            authorityField: "",
            authorityLocation: "",
        });
        setError("");
      }, 200); // Delay to allow closing animation
    }
  }, [isOpen, initialModeProp, userTypeProp]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (selectedType === "citizen") {
      if (
        !files.citizenshipFront.file ||
        !files.citizenshipBack.file ||
        !files.passportPhoto.file
      ) {
        setError("Please upload all required documents");
        return false;
      }
    } else if (selectedType === "authority") {
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
      if (mode === "login" || mode === "admin") {
        await login(formData.email, formData.password);
      } else if (mode === "signup" && (selectedType === 'citizen' || selectedType === 'authority')){
        await signup(
          formData.email,
          formData.password,
          formData.name,
          selectedType
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
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">
              {mode === "choose"
                ? "Choose Account Type"
                : mode === "admin"
                ? "Admin Login"
                : mode === "login"
                ? "Login"
                : "Sign Up"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === "choose" && (
            <div className="flex flex-col gap-4 items-center">
              <button
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                onClick={() => {
                  setSelectedType("citizen");
                  setMode("signup");
                }}
              >
                Sign up as Citizen
              </button>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setSelectedType("authority");
                  setMode("signup");
                }}
              >
                Sign up as Authority
              </button>
              <button
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setSelectedType("admin");
                  setMode("admin");
                }}
              >
                Admin Login
              </button>
              <button
                className="w-full bg-gray-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setSelectedType(null);
                  setMode("login");
                }}
              >
                Already have an account? Login
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === "signup" && selectedType && (
            <>
              <div className="mb-6 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedType === "citizen"
                      ? "bg-red-100 text-red-800"
                      : selectedType === "authority"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  {selectedType === "citizen"
                    ? "👤 Citizen Account"
                    : selectedType === "authority"
                    ? "🏛️ Authority Account"
                    : "🔑 Admin Account"}
                </span>
              </div>
              {/* ...existing signup form fields, uploads, etc. (same as before, but use selectedType instead of userType)... */}
              {/* ...existing code... */}
            </>
          )}

          {mode === "admin" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="admin@gmail.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="admin"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Login as Admin"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("choose");
                  setSelectedType(null);
                }}
                className="w-full mt-2 text-gray-900 hover:text-gray-700 font-medium"
              >
                Back
              </button>
            </form>
          )}

          {mode === "login" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("choose");
                  setSelectedType(null);
                }}
                className="w-full mt-2 text-red-600 hover:text-red-700 font-medium"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
