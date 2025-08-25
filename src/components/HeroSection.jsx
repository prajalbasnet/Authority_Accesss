import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NepalMap from "../assets/nepal-map.png";
import { FaUsers, FaClipboardList, FaCheckCircle, FaCheck } from "react-icons/fa";

// Complaints with province
const complaints = [
    { text: "बत्ती गयो, कहिले आउँछ ?", province: "Bagmati" },
    { text: "पानी आएन !", province: "Gandaki" },
    { text: "सडक भत्कियो !", province: "Lumbini" },
    { text: "चोरी भयो !", province: "Koshi" },
    { text: "लडाई भयो !", province: "Madhesh" },
    { text: "अस्पतालमा औषधि छैन !", province: "Sudurpashchim" },
    { text: "लाइन जान्छ बारम्बार !", province: "Bagmati" },
    { text: "अग्नि नियन्त्रण ढिलो भयो !", province: "Karnali" },
    { text: "नाला अबरुद्ध छ !", province: "Madhesh" },
    { text: "विद्यालय बन्द छ !", province: "Gandaki" },
    { text: "सडकमा धुलो धेरै !", province: "Lumbini" },
    { text: "पानीको दबाब कम !", province: "Koshi" },
    { text: "लाइन बारम्बार छुट्छ !", province: "Bagmati" },
    { text: "अस्पतालमा डाक्टर छैन !", province: "Madhesh" },
    { text: "अग्नि नियन्त्रण ढिला भयो !", province: "Sudurpashchim" },
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

export default function HeroSection() {
    const [activePopups, setActivePopups] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomComplaint =
                complaints[Math.floor(Math.random() * complaints.length)];

            const id = Date.now() + Math.random();

            setActivePopups((prev) => [
                ...prev,
                {
                    id,
                    text: randomComplaint.text,
                    province: randomComplaint.province,
                    coords: provinceCoords[randomComplaint.province],
                },
            ]);

            setTimeout(() => {
                setActivePopups((prev) => prev.filter((popup) => popup.id !== id));
            }, 3000);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-12 bg-white">
            {/* LEFT CONTENT */}
            <div className="md:w-1/2 flex flex-col gap-6 text-center md:text-left mt-10 md:mt-0">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
                    Report Complaints Easily
                </h1>
                <p className="text-sm md:text-base text-gray-700">
                    Directly notify authorities & track responses in real-time.
                </p>

                {/* Features list */}
                <div className="flex flex-col gap-2 mt-3 text-gray-700 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                        Submit complaints via <span className="font-semibold">Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                        Submit complaints via <span className="font-semibold">Photo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        Submit complaints via <span className="font-semibold">Text</span>
                    </div>
                </div>

                {/* Stats Section with Icons */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
                        <FaUsers className="text-blue-600 text-2xl md:text-3xl" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg md:text-xl">50,000+</span>
                            <span className="text-gray-600 text-xs md:text-sm">Citizens Registered</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg shadow-sm">
                        <FaClipboardList className="text-red-600 text-2xl md:text-3xl" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg md:text-xl">15,000+</span>
                            <span className="text-gray-600 text-xs md:text-sm">Complaints Filed</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg shadow-sm">
                        <FaCheckCircle className="text-green-600 text-2xl md:text-3xl" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg md:text-xl">12,500+</span>
                            <span className="text-gray-600 text-xs md:text-sm">Issues Resolved</span>
                        </div>
                    </div>
                </div>

                {/* Buttons + Approved Badge */}
                <div className="flex flex-col md:flex-row items-center gap-4 mt-5">
                    <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition w-full md:w-auto">
                        Get Started
                    </button>
                    <button className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition w-full md:w-auto">
                        Login
                    </button>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-semibold shadow-sm">
                        <FaCheck />
                        Approved by Government
                    </div>
                </div>

                {/* Small info */}
                <p className="mt-2 text-gray-500 text-xs md:text-sm">
                    Track complaints in real-time and get updates directly from authorities.
                </p>
            </div>

            {/* RIGHT SIDE MAP + POPUPS */}
            <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 relative">
                <motion.img
                    src={NepalMap}
                    alt="Nepal Map"
                    className="w-[300px] md:w-[480px] drop-shadow-2xl"
                    animate={{
                        filter: [
                            "drop-shadow(0 0 15px #2563eb)",
                            "drop-shadow(0 0 20px #ef4444)",
                            "drop-shadow(0 0 15px #ffffff)",
                        ],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                {/* Popups */}
                <AnimatePresence>
                    {activePopups.map((popup) => (
                        <motion.div
                            key={popup.id}
                            className="absolute bg-white/90 text-gray-800 text-[0.65rem] md:text-xs px-2 py-1 rounded-md shadow-md border border-gray-200 max-w-[140px] flex items-center gap-1"
                            style={{
                                top: `${popup.coords.y}%`,
                                left: `${popup.coords.x}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            initial={{ opacity: 0, scale: 0.5, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="font-semibold text-blue-600 text-[0.6rem]">
                                {popup.province} ➤
                            </span>
                            <span className="text-[0.6rem]">{popup.text}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
