import React from "react";
import {
  FaBolt,
  FaTint,
  FaRoad,
  FaShieldAlt,
  FaFire,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const authorities = [
  {
    name: "Electricity Authority",
    icon: <FaBolt size={40} className="text-yellow-500" />,
    description: "Manages electricity supply and related complaints.",
    responseTime: "2-4 hours",
    location: "Nationwide",
    phone: "1660-01-60005",
    email: "info@electricity.gov.np",
    total: 1560,
    resolved: 1420,
  },
  {
    name: "Road Transportation",
    icon: <FaRoad size={40} className="text-gray-700" />,
    description: "Oversees road infrastructure and transportation services.",
    responseTime: "1-3 days",
    location: "All major roads",
    phone: "01-4211682",
    email: "info@roadtransport.gov.np",
    total: 2340,
    resolved: 1980,
  },
  {
    name: "Cyber Bureau",
  icon: <FaShieldAlt size={40} className="text-indigo-600" />,
    description: "Handles cybercrime, digital security, and online fraud.",
    responseTime: "Immediate to 24 hours",
    location: "National",
    phone: "1111",
    email: "cyber@police.gov.np",
    total: 890,
    resolved: 760,
  },
  {
    name: "Water Supply",
    icon: <FaTint size={40} className="text-blue-400" />,
  description: "Ensures clean water supply.",
    responseTime: "4-8 hours",
    location: "Urban & Rural",
    phone: "01-4211594",
    email: "info@watersupply.gov.np",
    total: 890,
    resolved: 760,
  },
  {
    name: "Police Department",
    icon: <FaShieldAlt size={40} className="text-blue-800" />,
    description: "Maintains law and order, ensures public safety.",
    responseTime: "30 minutes",
    location: "Nationwide",
    phone: "100",
    email: "info@police.gov.np",
    total: 4500,
    resolved: 4300,
  },
  {
    name: "Fire Department",
    icon: <FaFire size={40} className="text-orange-500" />,
    description: "Responds to fire emergencies and rescue operations.",
    responseTime: "15 minutes",
    location: "Major cities",
    phone: "101",
    email: "info@fire.gov.np",
    total: 230,
    resolved: 230,
  },
];

const Authorities = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 md:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
          Key Government Authorities
        </h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          Connect directly with the relevant authorities to address your concerns and ensure swift resolution.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <AnimatePresence>
          {authorities.map((auth, idx) => {
            const successRate = auth.total > 0 ? Math.round((auth.resolved / auth.total) * 100) : 0;
            return (
              <motion.div
                key={auth.name} // Use name as key for better stability
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 flex flex-col h-full transform transition-all duration-300 ease-in-out hover:border-red-600"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 bg-blue-50 rounded-full flex items-center justify-center shadow-sm">
                    {auth.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {auth.name}
                  </h3>
                  <span className="ml-auto text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-gray-600 text-base mb-4 flex-grow">
                  {auth.description}
                </p>
                <ul className="text-gray-700 text-sm space-y-2 mb-5">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 text-lg">⏱</span> Response:{" "}
                    <span className="font-medium">{auth.responseTime}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 text-lg">📍</span>{" "}
                    <span className="font-medium">{auth.location}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 text-lg">📞</span>{" "}
                    <span className="font-medium">{auth.phone}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 text-lg">✉️</span>{" "}
                    <span className="font-medium">{auth.email}</span>
                  </li>
                </ul>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    <span className="text-blue-600">{auth.resolved}</span> Resolved out of{" "}
                    <span className="text-gray-600">{auth.total}</span> Total
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-md"
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-2">
                    Success Rate:{" "}
                    <span className="text-green-600">{successRate}%</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Authorities;
