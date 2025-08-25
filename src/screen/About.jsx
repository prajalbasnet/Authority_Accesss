// src/pages/About.jsx
import React from "react";
import { FaEye, FaLink, FaBolt, FaUniversity } from "react-icons/fa";
import MissionImg from "../assets/nepalflag.png"; // Transparent PNG / SVG recommended

export default function About() {
    return (
        <section className="w-full bg-gradient-to-b from-blue-50 to-white px-6 md:px-16 py-20">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-28">
                {/* Flag Left */}
                <div className="md:w-1/2 flex justify-center">
                    <div
                        className="w-120 h-120 overflow-hidden rounded-xl"
                        style={{
                            filter: "drop-shadow(0 10px 15px rgba(255,0,0,0.4))"
                        }}
                    >
                        <img
                            src={MissionImg}
                            alt="Nepal Flag"
                            className="w-full h-full object-cover animate-flag-wave"
                        />
                    </div>
                </div>



                {/* Text Right */}
                <div className="md:w-1/2 flex flex-col gap-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 leading-tight">
                        HamroGunaso : Nepal ko E-Governance Platform
                    </h1>
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                        HamroGunaso le Nepal ka nagarikharu lai sidhai authorities sanga
                        complaints file garna, track garna, ra feedback pauna sakchha. Saral,
                        transparent, ra digital grievance solution.
                    </p>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="mb-28 text-center max-w-3xl mx-auto bg-blue-50 p-10 rounded-2xl shadow-inner">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                    Our Mission
                </h2>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    To create a transparent, efficient, and accountable governance system
                    where every citizen's voice is heard, every complaint is addressed, and
                    every solution contributes to building a better Nepal.
                </p>
            </div>

            {/* Core Features / Values */}
            <div className="grid md:grid-cols-4 gap-10 text-center">
                {[{
                    icon: <FaEye className="text-blue-700 w-16 h-16 mb-2" />,
                    title: "Transparency",
                    desc: "All complaints are tracked publicly with real-time status updates.",
                }, {
                    icon: <FaLink className="text-blue-700 w-16 h-16 mb-2" />,
                    title: "Direct Access",
                    desc: "Connect directly with relevant government authorities without middlemen.",
                }, {
                    icon: <FaBolt className="text-blue-700 w-16 h-16 mb-2" />,
                    title: "Quick Response",
                    desc: "Automatic escalation system ensures timely responses to your complaints.",
                }, {
                    icon: <FaUniversity className="text-blue-700 w-16 h-16 mb-2" />,
                    title: "Better Governance",
                    desc: "Helping build a more responsive and accountable government system.",
                }].map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-4 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-3 bg-white"
                    >
                        {item.icon}
                        <h3 className="text-xl font-semibold text-blue-700">{item.title}</h3>
                        <p className="text-gray-600 text-sm md:text-base">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Flag wave animation CSS */}
            <style jsx>{`
                @keyframes wave {
                    0% { transform: translateX(0) translateY(0) rotate(0deg); }
                    25% { transform: translateX(2px) translateY(-2px) rotate(-1deg); }
                    50% { transform: translateX(-2px) translateY(2px) rotate(1deg); }
                    75% { transform: translateX(2px) translateY(-2px) rotate(-1deg); }
                    100% { transform: translateX(0) translateY(0) rotate(0deg); }
                }
                .animate-flag-wave {
                    animation: wave 3s infinite ease-in-out;
                }
            `}</style>
        </section>
    );
}
