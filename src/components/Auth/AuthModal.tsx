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
  const isAdmin = false;
  const [mode, setMode] = useState<"initial" | "login" | "signup">("initial");
  const [selectedType, setSelectedType] = useState<
    "citizen" | "authority" | null
  >(null);
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
        // await signup(...)
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
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">
              {mode === "login"
                ? "Welcome Back"
                : mode === "signup"
                ? selectedType === "citizen"
                  ? "Citizen Signup"
                  : "Authority Signup"
                : "Sign Up"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === "initial" && (
            <div className="flex flex-col gap-4 items-center">
              <button
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                onClick={() => {
                  setMode("signup");
                  setSelectedType("citizen");
                }}
              >
                Sign Up
              </button>
              <button
                className="w-full bg-gray-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                onClick={() => setMode("login")}
              >
                Already have an account? Login
              </button>
            </div>
          )}

          {mode === "signup" && (
            <>
              <div className="flex justify-center items-center mb-6">
                <div className="relative flex w-full max-w-xs bg-gray-200 rounded-full p-1">
                  <button
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      selectedType === "citizen"
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-600"
                    }`}
                    onClick={() => setSelectedType("citizen")}
                  >
                    Citizen
                  </button>
                  <button
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      selectedType === "authority"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600"
                    }`}
                    onClick={() => setSelectedType("authority")}
                  >
                    Authority
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                {selectedType === "citizen" && (
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
                {selectedType === "authority" && (
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
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
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
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
                  {loading ? "Please wait..." : "Create Account"}
                </button>
              </form>
              <div className="mt-6 text-center flex flex-col gap-2">
                <button
                  onClick={loginWithGoogle}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                    alt="Google"
                    className="w-5 h-5"
                  />{" "}
                  Sign in with Google
                </button>
                <button
                  onClick={loginWithFacebook}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    alt="Facebook"
                    className="w-5 h-5"
                  />{" "}
                  Sign in with Facebook
                </button>
                <button
                  onClick={() => {
                    setMode("login");
                    setSelectedType(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-medium mt-2"
                >
                  Already have an account? Login
                </button>
              </div>
            </>
          )}

          {mode === "login" && (
            <>
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
                      onChange={
                        isAdmin
                          ? undefined
                          : (e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
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
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
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
                  {loading ? "Please wait..." : "Sign In"}
                </button>
              </form>
              <div className="mt-6 text-center flex flex-col gap-2">
                <button
                  onClick={loginWithGoogle}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                    alt="Google"
                    className="w-5 h-5"
                  />{" "}
                  Sign in with Google
                </button>
                <button
                  onClick={loginWithFacebook}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    alt="Facebook"
                    className="w-5 h-5"
                  />{" "}
                  Sign in with Facebook
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setSelectedType(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-medium mt-2"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
