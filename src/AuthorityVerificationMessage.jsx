import { useNavigate } from "react-router-dom";

const AuthorityVerificationMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Registration Successful 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          We will verify you. Once verified, you will receive an email. Please check your email.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default AuthorityVerificationMessage;
