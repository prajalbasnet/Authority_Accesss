import React from "react";
import { FaBolt, FaTint, FaRoad, FaShieldAlt, FaHospital, FaFire, FaSeedling, FaBus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const authorities = [
    {
        name: "Nepal Electricity Authority",
        icon: <FaBolt size={40} className="text-yellow-500" />,
        description: "Handles electricity supply complaints",
        responseTime: "2-4 hours",
        location: "Nationwide",
        phone: "1660-01-60005",
        email: "electricity@nea.org.np",
        total: 156,
        resolved: 142,
    },
    {
        name: "Water Supply Management Board",
        icon: <FaTint size={40} className="text-blue-400" />,
        description: "Water supply and sanitation issues",
        responseTime: "4-8 hours",
        location: "Kathmandu Valley",
        phone: "01-4211594",
        email: "water@wsmb.gov.np",
        total: 89,
        resolved: 76,
    },
    {
        name: "Department of Roads",
        icon: <FaRoad size={40} className="text-gray-700" />,
        description: "Road maintenance and construction",
        responseTime: "1-3 days",
        location: "All highways and major roads",
        phone: "01-4211682",
        email: "roads@dor.gov.np",
        total: 234,
        resolved: 198,
    },
    {
        name: "Nepal Police",
        icon: <FaShieldAlt size={40} className="text-blue-800" />,
        description: "Law enforcement and public safety",
        responseTime: "30 minutes",
        location: "Nationwide",
        phone: "100",
        email: "police@nepalpolice.gov.np",
        total: 45,
        resolved: 43,
    },
    {
        name: "Department of Health Services",
        icon: <FaHospital size={40} className="text-red-500" />,
        description: "Healthcare and medical services",
        responseTime: "1-2 hours",
        location: "All public hospitals",
        phone: "01-4262802",
        email: "health@dohs.gov.np",
        total: 67,
        resolved: 59,
    },
    {
        name: "Fire Department",
        icon: <FaFire size={40} className="text-orange-500" />,
        description: "Fire emergency and rescue services",
        responseTime: "15 minutes",
        location: "Major cities",
        phone: "101",
        email: "fire@fire.gov.np",
        total: 23,
        resolved: 23,
    },
    {
        name: "Ministry of Agriculture",
        icon: <FaSeedling size={40} className="text-green-600" />,
        description: "Agricultural development and support",
        responseTime: "2-7 days",
        location: "Rural areas",
        phone: "01-4211932",
        email: "agriculture@moad.gov.np",
        total: 112,
        resolved: 98,
    },
    {
        name: "Department of Transport Management",
        icon: <FaBus size={40} className="text-yellow-700" />,
        description: "Public transport and traffic management",
        responseTime: "1-2 days",
        location: "Major routes",
        phone: "01-4258474",
        email: "transport@dotm.gov.np",
        total: 78,
        resolved: 65,
    },
];

const Authorities = () => {
    return (
        <section className="min-h-screen bg-gray-50 py-12 px-4 md:px-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Available Authorities</h2>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                    Connect with verified government departments to resolve your issues efficiently.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                <AnimatePresence>
                    {authorities.map((auth, idx) => {
                        const successRate = Math.round((auth.resolved / auth.total) * 100);
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">{auth.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-800">{auth.name}</h3>
                                    <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Verified</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{auth.description}</p>
                                <ul className="text-gray-700 text-xs space-y-2 mb-4">
                                    <li className="flex items-center gap-2"><span className="text-blue-500">⏱</span> Response: {auth.responseTime}</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">📍</span> {auth.location}</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">📞</span> {auth.phone}</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">✉️</span> {auth.email}</li>
                                </ul>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-2">
                                        {auth.total} Total | {auth.resolved} Resolved
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full bg-green-500"
                                            style={{ width: `${successRate}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 mt-2">Success Rate: {successRate}%</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center mt-12 p-6 bg-blue-50 rounded-xl max-w-3xl mx-auto"
            >
                <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">Need Assistance?</h3>
                <p className="text-gray-700 text-sm md:text-base mb-4">
                    Register to submit complaints and track responses from verified authorities.
                </p>
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-blue-600 text-white text-sm md:text-base font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    href="/register"
                >
                    Register Now
                </motion.a>
            </motion.div>
        </section>
    );
};

export default Authorities;