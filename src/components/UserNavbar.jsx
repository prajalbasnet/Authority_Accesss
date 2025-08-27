import React, { useState, useEffect, useRef } from "react";
import {
    FileText,
    MessageSquare,
    Search,
    Bell,
    User,
    LogOut,
    Camera,
    Menu,
    X,
    Settings,
    Moon,
    Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const UserNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const location = useLocation();

    const profileRef = useRef(null);
    const notificationRef = useRef(null);
    const searchRef = useRef(null);

    // theme toggle
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    const mobileMenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    };

    const navItems = [
        { icon: FileText, label: "Fill", path: "/fill" },
        { icon: MessageSquare, label: "Feed", path: "/feed" },
        { icon: Search, label: "Track", path: "/track" },
        { icon: Bell, label: "Response", path: "/response", badge: 3 },
    ];

    return (
        <nav
            className={`w-full sticky top-0 z-50 ${theme === "dark" ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                } shadow-md px-6 py-3 flex items-center justify-between transition-colors duration-300`}
        >
            {/* Left Branding */}
            <div className="flex items-center gap-3">
                <motion.div
                    className="bg-blue-600 p-2 rounded-xl"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <FileText className="text-white w-7 h-7" />
                </motion.div>
                <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                    HamroGunaso
                </h1>
            </div>

            {/* Center Menu */}
            <div className="hidden md:flex items-center gap-10">
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.button
                            key={index}
                            className={`flex flex-col items-center relative group ${theme === "dark"
                                ? "text-white hover:text-blue-300"
                                : "text-blue-700 hover:text-blue-600"
                                } transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                                <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {/* Active underline */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-underline"
                                    className="absolute -bottom-2 w-8 h-1 bg-blue-600 rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Search */}
                <motion.button
                    className={`hidden md:block ${theme === "dark"
                        ? "text-white hover:text-blue-300"
                        : "text-blue-700 hover:text-blue-600"
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="w-6 h-6" />
                </motion.button>

                {/* Notification */}
                <div className="relative hidden md:block" ref={notificationRef}>
                    <motion.button
                        className={`relative ${theme === "dark"
                            ? "text-white hover:text-blue-300"
                            : "text-blue-700 hover:text-blue-600"
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNotificationOpen(!notificationOpen)}
                    >
                        <Bell className="w-6 h-6" />
                        <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                            2
                        </span>
                    </motion.button>
                    <AnimatePresence>
                        {notificationOpen && (
                            <motion.div
                                className={`absolute right-0 mt-2 w-64 ${theme === "dark" ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                                    } rounded-lg shadow-xl border border-blue-200 dark:border-blue-700 p-4`}
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="text-sm font-medium">Notifications</div>
                                <ul className="mt-2 space-y-2">
                                    <li className="text-sm hover:bg-blue-100 dark:hover:bg-blue-800 p-2 rounded">
                                        New response to your complaint
                                    </li>
                                    <li className="text-sm hover:bg-blue-100 dark:hover:bg-blue-800 p-2 rounded">
                                        System update available
                                    </li>
                                    <li className="text-sm hover:bg-blue-100 dark:hover:bg-blue-800 p-2 rounded">
                                        Profile verification completed
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <motion.button
                    className={`${theme === "dark"
                        ? "text-white hover:text-blue-300"
                        : "text-blue-700 hover:text-blue-600"
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.button>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <motion.img
                        src="https://i.pravatar.cc/40"
                        alt="User profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-600"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setProfileOpen(!profileOpen)}
                    />
                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                className={`absolute right-0 mt-2 w-56 ${theme === "dark" ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                                    } rounded-lg shadow-xl border border-blue-200 dark:border-blue-700`}
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800">
                                    <User className="w-4 h-4 text-blue-600" />
                                    View Profile
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800">
                                    <Camera className="w-4 h-4 text-blue-600" />
                                    Change Profile Picture
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800">
                                    <Settings className="w-4 h-4 text-blue-600" />
                                    Settings
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-800 text-red-600">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    className={`md:hidden ${theme === "dark"
                        ? "text-white hover:text-blue-300"
                        : "text-blue-700 hover:text-blue-600"
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className={`absolute top-14 left-0 w-full ${theme === "dark" ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                            } shadow-md flex flex-col md:hidden border-t border-blue-200 dark:border-blue-700`}
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                className="px-4 py-3 flex items-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-800"
                            >
                                <item.icon className="w-5 h-5 text-blue-600" />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className={`w-full max-w-lg p-6 rounded-lg ${theme === "dark" ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                                } border border-blue-200 dark:border-blue-700`}
                            ref={searchRef}
                        >
                            <div className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Search complaints..."
                                    className={`w-full p-2 rounded-lg border ${theme === "dark"
                                        ? "bg-blue-800 border-blue-700 text-white"
                                        : "bg-blue-50 border-blue-300 text-blue-900"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className={
                                        theme === "dark"
                                            ? "text-white hover:text-blue-300"
                                            : "text-blue-700 hover:text-blue-600"
                                    }
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default React.memo(UserNavbar);
