import React from "react";
import Logo from "../assets/HamroGunaso.png";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-10 px-6 mt-10 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <img src={Logo} alt="HamroGunaso Logo" className="h-24 mb-0" />
          <p className="text-sm leading-relaxed opacity-90">
            HamroGunaso is Nepal's pioneering e-governance platform designed to
            bridge the gap between citizens and authorities with transparency
            and ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Resources</h2>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="#" className="hover:text-gray-300">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
          <p className="text-sm opacity-90 flex items-center gap-2">
            <FaEnvelope /> support@hamroGunaso.com
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-gray-300 text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-gray-300 text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-gray-300 text-xl">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm opacity-90">
        © {new Date().getFullYear()} HamroGunaso. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
