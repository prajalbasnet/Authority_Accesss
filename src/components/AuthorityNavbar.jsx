import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthorityNavbar = () => {
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

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <Link to="/authority/dashboard" className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-lg uppercase text-blue-50" style={{letterSpacing:'0.08em'}}>
          Authority Portal
        </Link>
        {/* Optionally, show authority type or name here */}
        {user?.authorityType && (
          <span className="ml-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-700 cursor-default">
            {user.authorityType}
          </span>
        )}
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition-all font-semibold shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AuthorityNavbar;
