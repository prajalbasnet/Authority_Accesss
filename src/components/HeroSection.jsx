import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import NepalMap from "../assets/nepal-map.png";
import {
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaCheck,
} from "react-icons/fa";

import { Mic, Camera, FileText, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import heroBack from "../assets/heroback.jpg";

// Complaints with province
const complaints = [
  { text: "बत्ती गयो, कहिले आउँछ ?", province: "Bagmati", type: "power" },
  { text: "पानी आएन !", province: "Gandaki", type: "water" },
  { text: "सडक भत्कियो !", province: "Lumbini", type: "road" },
  { text: "चोरी भयो !", province: "Koshi", type: "security" },
  { text: "लडाई भयो !", province: "Madhesh", type: "security" },
  { text: "अस्पतालमा औषधि छैन !", province: "Sudurpashchim", type: "health" },
  { text: "लाइन जान्छ बारम्बार !", province: "Bagmati", type: "power" },
  {
    text: "अग्नि नियन्त्रण ढिलो भयो !",
    province: "Karnali",
    type: "emergency",
  },
  { text: "नाला अबरुद्ध छ !", province: "Madhesh", type: "sanitation" },
  { text: "विद्यालय बन्द छ !", province: "Gandaki", type: "education" },
  { text: "सडकमा धुलो धेरै !", province: "Lumbini", type: "environment" },
  { text: "पानीको दबाब कम !", province: "Koshi", type: "water" },
  { text: "लाइन बारम्बार छुट्छ !", province: "Bagmati", type: "power" },
  { text: "अस्पतालमा डाक्टर छैन !", province: "Madhesh", type: "health" },
  {
    text: "अग्नि नियन्त्रण ढिला भयो !",
    province: "Sudurpashchim",
    type: "emergency",
  },
];

// Province coordinates on map (% relative)
const provinceCoords = {
  Bagmati: { x: 50, y: 50 },
  Gandaki: { x: 40, y: 40 },
  Lumbini: { x: 30, y: 60 },
  Koshi: { x: 70, y: 40 },
  Madhesh: { x: 65, y: 70 },
  Sudurpashchim: { x: 15, y: 65 },
  Karnali: { x: 25, y: 35 },
};

// Complaint type colors
const typeColors = {
  power: "bg-yellow-100 text-yellow-800 border-yellow-200",
  water: "bg-blue-100 text-blue-800 border-blue-200",
  road: "bg-gray-100 text-gray-800 border-gray-200",
  security: "bg-red-100 text-red-800 border-red-200",
  health: "bg-green-100 text-green-800 border-green-200",
  emergency: "bg-orange-100 text-orange-800 border-orange-200",
  sanitation: "bg-purple-100 text-purple-800 border-purple-200",
  education: "bg-indigo-100 text-indigo-800 border-indigo-200",
  environment: "bg-teal-100 text-teal-800 border-teal-200",
};

export default function HeroSection() {
  const [activePopups, setActivePopups] = useState([]);
  const [currentStat, setCurrentStat] = useState(0);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for login status

  useEffect(() => {
    // Complaint popups
    const complaintInterval = setInterval(() => {
      const randomComplaint =
        complaints[Math.floor(Math.random() * complaints.length)];
      const id = Date.now() + Math.random();

      setActivePopups((prev) => [
        ...prev,
        {
          id,
          text: randomComplaint.text,
          province: randomComplaint.province,
          type: randomComplaint.type,
          coords: provinceCoords[randomComplaint.province],
        },
      ]);

      setTimeout(() => {
        setActivePopups((prev) => prev.filter((popup) => popup.id !== id));
      }, 3000);
    }, 1500);

    // Stats rotation
    const statsInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 3);
    }, 3000);

    // Placeholder for checking login status (replace with actual logic)
    const userToken = localStorage.getItem("userToken"); // Example
    setIsLoggedIn(!!userToken);

    return () => {
      clearInterval(complaintInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const stats = [
    {
      icon: FaUsers,
      value: "50,000+",
      label: "Citizens Registered",
      color: "blue",
    },
    {
      icon: FaClipboardList,
      value: "15,000+",
      label: "Complaints Filed",
      color: "red",
    },
    {
      icon: FaCheckCircle,
      value: "12,500+",
      label: "Issues Resolved",
      color: "green",
    },
  ];

  const features = [
    {
      icon: Mic,
      title: "Voice Complaints",
      description: "Record and submit complaints using your voice",
      color: "red",
    },
    {
      icon: Camera,
      title: "Photo Evidence",
      description: "Upload photos to support your complaints",
      color: "blue",
    },
    {
      icon: FileText,
      title: "Text Reports",
      description: "Write detailed descriptions of issues",
      color: "green",
    },
  ];

  const handleComplaintClick = () => {
    if (isLoggedIn) {
      navigate("/user/file-complaint");
    } else {
      toast.error("Please login to register your complain"); // Using react-hot-toast
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 bg-gray-50 overflow-hidden">
      <Toaster /> {/* Add Toaster component here */}
      {/* Background faint Nepal flag watermark */}
      <div
        className="absolute inset-0 opacity-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBack})` }}
      ></div>
      {/* LEFT CONTENT */}
      <motion.div
        className="lg:w-1/2 flex flex-col gap-6 text-center lg:text-left mt-16 lg:mt-0 relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl mt-1 font-extrabold text-red-600 drop-shadow-sm text-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Report Complaints
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-blue-900 font-bold">
              Made Easy
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-800 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Directly connect with authorities and track your complaints in
            real-time.
            <span className="font-semibold text-red-600">
              {" "}
              <br /> Your voice{" "}
            </span>
            matters in building a stronger Nepal.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:translate-y-1"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-gray-100">
                <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStat}
              className={`flex items-center gap-4 p-2 rounded-2xl ${
                stats[currentStat].color === "blue"
                  ? "bg-blue-50"
                  : stats[currentStat].color === "red"
                  ? "bg-red-50"
                  : "bg-green-50"
              } shadow-md border`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {React.createElement(stats[currentStat].icon, {
                className: `text-3xl ${
                  stats[currentStat].color === "blue"
                    ? "text-blue-600"
                    : stats[currentStat].color === "red"
                    ? "text-red-600"
                    : "text-green-600"
                }`,
              })}
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats[currentStat].value}
                </div>
                <div className="text-sm text-gray-600">
                  {stats[currentStat].label}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button
            onClick={handleComplaintClick}
            className="group bg-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:bg-red-700 transition-all duration-300 flex items-center gap-3"
          >
            Record your complaints
            <Mic className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-6 flex items-center gap-6 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        ></motion.div>
      </motion.div>
      {/* RIGHT CONTENT: Nepal Map with popups */}
      <motion.div
        className="lg:w-1/2 flex justify-center mt-12 lg:mt-0 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="relative">
          <motion.img
            src={NepalMap}
            alt="Map of Nepal indicating real-time complaints across provinces"
            className="w-[280px] sm:w-[350px] lg:w-[480px] drop-shadow-2xl"
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(220, 20, 60, 0.3))",
                "drop-shadow(0 0 30px rgba(0, 56, 147, 0.3))",
                "drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))",
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          <AnimatePresence>
            {activePopups.map((popup) => (
              <motion.div
                key={popup.id}
                className={`absolute text-gray-800 text-xs px-3 py-2 rounded-lg shadow-lg border max-w-[160px] ${
                  typeColors[popup.type] || "bg-gray-100 border-gray-200"
                }`}
                style={{
                  top: `${popup.coords.y}%`,
                  left: `${popup.coords.x}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -10 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600 text-[0.7rem]">
                    {popup.province} →
                  </span>
                  <span className="text-[0.7rem]">{popup.text}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
