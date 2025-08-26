import React, { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 shadow-sm bg-white">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    H
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Hamro<span className="text-gray-800 font-semibold">Gunaso</span>
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">गुनासो समाधान</p>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8 text-gray-600 font-medium">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <Link to="/about" className="hover:text-blue-600">About</Link>
                <Link to="/authorities" className="hover:text-blue-600">Authorities</Link>
                <Link to="/how-to-use" className="hover:text-blue-600">How to Use</Link>
                <Link to="/terms-policy" className="hover:text-blue-600">Terms & Policy</Link>
                <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center space-x-5">
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>English</span>
                </button>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700">
                    Sign Up
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-gray-700" onClick={() => setOpen(!open)}>
                {open ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 lg:hidden">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <Link to="/about" className="hover:text-blue-600">About</Link>
                    <Link to="/authorities" className="hover:text-blue-600">Authorities</Link>
                    <Link to="/how-to-use" className="hover:text-blue-600">How to Use</Link>
                    <Link to="/terms-policy" className="hover:text-blue-600">Terms & Policy</Link>
                    <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
                    <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <Globe className="w-4 h-4 mr-1" />
                        <span>नेपाली</span>
                    </button>
                    <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                    <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700">
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
