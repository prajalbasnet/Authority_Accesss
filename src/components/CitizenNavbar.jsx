import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const CitizenNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getKycBadge = () => {
    if (!user) return null;

    const status = (user.status || "UNVERIFIED").toUpperCase();
    let badgeText = "";
    let badgeColor = "";
    let linkTo = "/citizen/kyc";

    switch (status) {
      case "VERIFIED":
        badgeText = "Verified";
        badgeColor = "bg-green-500";
        linkTo = "/citizen/profile";
        break;
      case "PENDING":
        badgeText = "KYC Pending";
        badgeColor = "bg-yellow-500";
        break;
      case "REJECTED":
        badgeText = "KYC Rejected";
        badgeColor = "bg-red-500";
        break;
      case "UNVERIFIED":
      default:
        badgeText = "Unverified";
        badgeColor = "bg-gray-600";
        break;
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
            <span className="hidden md:block">{user ? user.fullName : 'Profile'}</span>
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
