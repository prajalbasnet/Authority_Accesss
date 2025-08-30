
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaCheckDouble } from "react-icons/fa";
import { fetchNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../services/notificationService';

const AuthorityNavbar = () => {
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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId).then(() => {
      fetchNotifications().then(setNotifications);
      getUnreadCount().then(setUnreadCount);
    });
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.link) {
      navigate(notification.link);
    }
    setNotificationDropdownOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead().then(() => {
      fetchNotifications().then(setNotifications);
      getUnreadCount().then(setUnreadCount);
    });
  };

  return (
    <nav className="bg-blue-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/authority" className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-lg uppercase text-blue-50" style={{letterSpacing:'0.08em'}}>
            Authority Portal
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              className="relative focus:outline-none"
            >
              <FaBell className="text-3xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 text-gray-900">
                <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FaCheckDouble className="mr-1" /> Mark All Read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">No new notifications.</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${notif.read ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-900 font-semibold'}`}
                        onClick={() => handleNotificationClick(notif.id)}
                      >
                        <p className="text-sm font-bold">{notif.title}</p>
                        <p className="text-xs mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle className="text-4xl" />
              <span className="hidden md:block">{user ? user.fullName : 'Profile'}</span>
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

export default AuthorityNavbar;
