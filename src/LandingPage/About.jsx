// src/pages/About.jsx
import React from "react";
import { FaEye, FaLink, FaBolt, FaUniversity } from "react-icons/fa";
import MissionImg from "../assets/nepalflag.png"; // Transparent PNG or SVG recommended

export default function About() {
  const features = [
    {
      icon: <FaEye className="text-red-700 w-16 h-16 mb-4" />,
      title: "Unwavering Transparency",
      desc: "Every complaint is publicly tracked, offering real-time status updates and fostering complete accountability.",
    },
    {
      icon: <FaLink className="text-red-700 w-16 h-16 mb-4" />,
      title: "Direct Citizen Access",
      desc: "Connect directly with relevant government authorities, eliminating intermediaries and ensuring your voice is heard.",
    },
    {
      icon: <FaBolt className="text-red-700 w-16 h-16 mb-4" />,
      title: "Rapid Response System",
      desc: "Our automated escalation ensures timely attention and swift resolution to your critical complaints.",
    },
    {
      icon: <FaUniversity className="text-red-700 w-16 h-16 mb-4" />,
      title: "Catalyst for Good Governance",
      desc: "We empower a more responsive and accountable government, driving positive change across the nation.",
    },
  ];

  return (
    <section className="w-full bg-gray-100 opacity-100 px-6 md:px-16 py-20 font-poppins">
      {/* Header / Intro */}
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-28">
        {/* Flag Left - Enhanced Visual */}
        <div className="md:w-1/2 flex justify-center relative">
          <div
            className="w-96 h-96 md:w-[32rem] md:h-[32rem] overflow-hidden rounded-full border-8 border-blue-800 shadow-2xl flex items-center justify-center"
            style={{
              filter: "drop-shadow(0 20px 30px rgba(220, 20, 60, 0.6))",
              background: "linear-gradient(45deg, #DC143C, #00008B)",
            }}
          >
            <img
              src={MissionImg}
              alt="Nepal Flag"
              className="w-4/5 h-4/5 mt-25 object-contain animate-flag-wave"
            />
          </div>
        </div>

        {/* Text Right - More Impactful */}
        <div className="md:w-1/2 flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg text-center md:text-left">
            <span className="text-red-600">Empowering</span> Citizens
            <br />
            <span className="text-red-600">Inclusive</span> Governance
          </h1>

          <p className="text-lg md:text-xl text-gray-800 leading-relaxed mt-4 text-center md:text-left">
             "
            <span className="text-blue-700 font-bold">
              Hamro
            </span>
              <span className="text-red-600 font-bold">
              Gunaso
            </span>{" "}
            is Nepal's pioneering e-governance platform, designed to bridge the
            gap between citizens and authorities. File complaints, track
            progress, and receive direct feedback with unparalleled ease and
            transparency. This is the future of digital grievance resolution in
            Nepal."
          </p>
        </div>
      </div>

      {/* Core Features / Values */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-4 bg-white border-t-4 border-blue-800"
          >
            {item.icon}
            <h3 className="text-2xl font-bold text-blue-800">{item.title}</h3>
            <p className="text-gray-700 text-base">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Flag wave animation */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(2px) translateY(-2px) rotate(-1deg);
          }
          50% {
            transform: translateX(-2px) translateY(2px) rotate(1deg);
          }
          75% {
            transform: translateX(2px) translateY(-2px) rotate(-1deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
        }
        .animate-flag-wave {
          animation: wave 3s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
// Moved to features/landing/pages/About.jsx
