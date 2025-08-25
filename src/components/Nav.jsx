import React, { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 flex justify-between  items-center px-6 py-3 shadow-sm bg-white  ">
            {/* Left Section (Logo + Brand) */}
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

            {/* Center Menu (Desktop only from lg:) */}
            <div className="hidden lg:flex space-x-8 text-gray-600 font-medium">
                <a href="#home" className="hover:text-blue-600">Home</a>
                <a href="#about" className="hover:text-blue-600">About</a>
                <a href="#authorities" className="hover:text-blue-600">Authorities</a>
                <a href="#howtouse" className="hover:text-blue-600">How to Use</a>
                <a href="#terms" className="hover:text-blue-600">Terms & Policy</a>
            </div>

            {/* Right Section (Desktop only from lg:) */}
            <div className="hidden lg:flex items-center space-x-5">
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>English</span>
                </button>
                <a href="#login" className="text-gray-700 hover:text-blue-600">Login</a>
                <a
                    href="#signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700"
                >
                    Sign Up
                </a>
            </div>

            {/* Hamburger Button (Visible until lg) */}
            <button
                className="lg:hidden text-gray-700"
                onClick={() => setOpen(!open)}
            >
                {open ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile & Tablet Menu */}
            {open && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 lg:hidden">
                    <a href="#home" className="hover:text-blue-600">Home</a>
                    <a href="#about" className="hover:text-blue-600">About</a>
                    <a href="#authorities" className="hover:text-blue-600">Authorities</a>
                    <a href="#howtouse" className="hover:text-blue-600">How to Use</a>
                    <a href="#terms" className="hover:text-blue-600">Terms & Policy</a>
                    <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <Globe className="w-4 h-4 mr-1" />
                        <span>नेपाली</span>
                    </button>
                    <a href="#login" className="text-gray-700 hover:text-blue-600">Login</a>
                    <a
                        href="#signup"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700"
                    >
                        Sign Up
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
