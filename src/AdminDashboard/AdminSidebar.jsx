
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaUserShield, FaClipboardList, FaIdCard, FaSignOutAlt } from "react-icons/fa";

const links = [
  { to: "/admin", label: "Dashboard", icon: <FaChartBar />, end: true },
  { to: "/admin/complaints", label: "Complaints", icon: <FaClipboardList /> },
  { to: "/admin/authorities", label: "Authorities", icon: <FaUserShield /> },
  { to: "/admin/citizens", label: "Citizens", icon: <FaUsers /> },
  { to: "/admin/kyc-requests", label: "KYC Requests", icon: <FaIdCard /> },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className="w-72 min-h-screen flex flex-col py-8 px-6 bg-white/20 backdrop-blur-2xl shadow-2xl border-r border-blue-900 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,64,175,0.93) 100%)',
        boxShadow: '0 8px 32px 0 rgba(15,23,42,0.45)',
      }}
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/60 to-blue-400/30 blur-2xl opacity-60 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col items-center mb-10">
        <span className="text-lg font-bold text-blue-50 tracking-wide drop-shadow-lg mt-2">Welcome, <span className="font-extrabold text-blue-100">Admin</span>!</span>
      </div>
      <nav className="flex-grow relative z-10">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-xl scale-105 ring-2 ring-blue-400/80 border border-blue-400/80'
                      : 'text-blue-100/90 hover:bg-blue-800/90 hover:text-white hover:scale-105'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        boxShadow: '0 6px 32px 0 rgba(30,64,175,0.35)',
                        border: '2px solid #2563eb',
                      }
                    : {}
                }
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="tracking-wide">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-8 border-t border-blue-200 text-xs text-blue-300 text-center tracking-wide relative z-10">
        <button
          className="flex items-center gap-2 px-4 py-2 mt-4 rounded-lg bg-blue-100/40 text-blue-700 hover:bg-blue-200/60 transition-all font-semibold shadow-md mx-auto"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
        <div className="pt-4">&copy; 2025 Authority Access</div>
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-24 bg-blue-400/30 blur-3xl rounded-full opacity-60 z-0" />
    </aside>
  );
};

export default AdminSidebar;
