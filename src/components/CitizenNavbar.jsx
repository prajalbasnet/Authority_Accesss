import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Using react-icons for a profile icon

const CitizenNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState(null); // null, 'pending', 'verified'
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem("isKycVerified");
    setKycStatus(status);

    // Listen for changes in localStorage (e.g., from KycVerification page)
    const handleStorageChange = () => {
      setKycStatus(localStorage.getItem("isKycVerified"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    localStorage.removeItem("isKycVerified"); // Clear KYC status on logout
    navigate("/login"); // Redirect to login page
  };

  const getKycBadge = () => {
    let badgeText = "Unverified";
    let badgeColor = "bg-gray-500";
    let linkTo = "/citizen/kyc";

    if (kycStatus === "pending") {
      badgeText = "KYC Pending";
      badgeColor = "bg-yellow-500";
      linkTo = "/citizen/kyc"; // Still link to KYC page if pending
    } else if (kycStatus === "verified") {
      badgeText = "Verified";
      badgeColor = "bg-green-500";
      linkTo = "/citizen/profile"; // Or a profile page
    }

    return (
      <Link
        to={linkTo}
        className={`ml-4 px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColor}`}
      >
        {badgeText}
      </Link>
    );
  };

  return (
    <nav className="bg-blue-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/citizen" className="text-2xl font-bold">
            Citizen Portal
          </Link>
          {getKycBadge()}
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <FaUserCircle className="text-4xl" />
            <span className="hidden md:block">Profile</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <Link
                to="/citizen/dashboard"
                className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/citizen/profile"
                className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CitizenNavbar;
