import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  // ...existing code...
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  userType?: "citizen" | "authority";
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
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const onDrop = (acceptedFiles: File[], field: string) => {
    setFiles((prevFiles) => ({ ...prevFiles, [field]: acceptedFiles[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        const signupData = {
          ...formData,
          files,
        };
        console.log(signupData);
        // await signup(
        //   formData.email,
        //   formData.password,
        //   formData.name,
        //   userType
        // );
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  if (!isOpen) return null;

  const renderFileUpload = (field: string, label: string) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => onDrop(files, field),
      multiple: false,
    });
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-red-500"
        >
          <input {...getInputProps()} />
          {files[field] ? (
            <p>{(files[field] as File).name}</p>
          ) : (
            <p>Drag 'n' drop a file here, or click to select a file</p>
          )}
        </div>
      </div>
    );
  };

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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Only allow signup for non-admin users */}
            {mode === "signup" && !isAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
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
                    />
                  </div>
                </div>

                {userType === "citizen" && (
                  <>
                    {renderFileUpload(
                      "citizenshipFront",
                      "Citizenship Card (Front)"
                    )}
                    {renderFileUpload(
                      "citizenshipBack",
                      "Citizenship Card (Back)"
                    )}
                    {renderFileUpload(
                      "passportPhoto",
                      "Recent Passport Size Photo"
                    )}
                  </>
                )}

                {userType === "authority" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authority Field
                      </label>
                      <select
                        required
                        value={formData.authorityField}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            authorityField: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select field</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Water">Water</option>
                        <option value="Roads">Roads</option>
                        <option value="Cyber Bureau">Cyber Bureau</option>
                        <option value="Police">Police</option>
                        <option value="Transportation">Transportation</option>
                      </select>
                    </div>
                    {renderFileUpload("officeIdCard", "Office ID Card")}
                  </>
                )}
              </>
            )}

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
                Password
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
