
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-lg uppercase text-blue-50" style={{letterSpacing:'0.08em'}}>
            Admin Portal
          </span>
        </div>
        <div className="flex items-center space-x-6">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle className="text-4xl" />
              <span className="hidden md:block">Admin</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
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
      </div>
    </nav>
  );
};

export default AdminNavbar;
