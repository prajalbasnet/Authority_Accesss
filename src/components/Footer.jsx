import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-blue-700 text-white">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-8">

                {/* Logo & Description */}
                <div>
                    <h2 className="text-2xl font-bold mb-3 text-white underline decoration-blue-500 decoration-2">
                        HamroGunaso
                    </h2>
                    <p className="text-gray-300 leading-relaxed mt-2">
                        HamroGunasO helps you submit complaints to relevant authorities
                        easily, transparently, and effectively.
                    </p>

                    {/* Tagline */}
                    <div className="mt-6 text-gray-300 text-sm italic flex items-center gap-2">
                        <span className="text-lg">🇳🇵</span>
                        <span className="border-l border-gray-400 pl-2">
                            नेपाल सरकारको आधिकारिक गुनासो समाधान
                        </span>
                    </div>
                </div>


                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-red-400 transition">Home</a></li>
                        <li><a href="/about" className="hover:text-red-400 transition">About</a></li>
                        <li><a href="/terms" className="hover:text-red-400 transition">Terms & Policy</a></li>
                        <li><a href="/authorities" className="hover:text-red-400 transition">Authorities</a></li>
                        <li><a href="/contact" className="hover:text-red-400 transition">Contact</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Services</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>Complaint Filing</li>
                        <li>Status Tracking</li>
                        <li>Authority Connect</li>
                        <li>Public Updates</li>
                    </ul>
                </div>

                {/* Authorities List */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Authorities</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>Nepal Electricity Authority</li>
                        <li>Department of Roads</li>
                        <li>Nepal Police</li>
                        <li>Fire Department</li>
                        <li>Water Supply & Sanitation</li>
                        <li>Public Transport Authority</li>
                        <li>Ministry of Health</li>
                        <li>Environment & Forestry</li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
                    <p className="text-gray-300">📧 support@hamrogunaso.com</p>
                    <p className="text-gray-300">📞 +977 9800000000</p>
                    <div className="flex gap-5 mt-5">
                        <a href="#" className="hover:text-blue-400 transition">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" className="hover:text-sky-400 transition">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" className="hover:text-pink-400 transition">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 py-5 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} HamroGunasO. All rights reserved.
            </div>
        </footer>
    );
}
