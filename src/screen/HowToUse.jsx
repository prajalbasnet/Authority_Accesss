import React from "react";
import { FaUserCheck, FaSignInAlt, FaClipboardList, FaSearch, FaBell } from "react-icons/fa";

export default function HowToUse() {
    const steps = [
        {
            icon: <FaUserCheck className="text-white text-2xl" />,
            title: "Sign Up & KYC Verify",
            description:
                "HamroGunaso मा खाता बनाउनुहोस् र KYC प्रमाणिकरण गर्नुहोस्। त्यसपछि मात्र गुनासो पेश गर्न सकिन्छ।",
        },
        {
            icon: <FaSignInAlt className="text-white text-2xl" />,
            title: "Login to Dashboard",
            description:
                "प्रमाणिकरणपछि लगइन गरी आफ्नो व्यक्तिगत ड्यासबोर्डमा जानुहोस्। त्यहाँ सबै सुविधा प्रयोग गर्न सकिन्छ।",
        },
        {
            icon: <FaClipboardList className="text-white text-2xl" />,
            title: "Submit Complaint",
            description:
                "ड्यासबोर्डमा 'नयाँ गुनासो' रोज्नुहोस्। सम्बन्धित निकाय छानेर समस्याको विवरण लेखेर पेश गर्नुहोस्।",
        },
        {
            icon: <FaSearch className="text-white text-2xl" />,
            title: "Track Status",
            description:
                "गुनासो पेश गरेपछि 'मेरो गुनासो' सेक्सनमा गएर गुनासोको स्थिति (पेन्डिङ, प्रगति, समाधान) हेर्न सकिन्छ।",
        },
        {
            icon: <FaBell className="text-white text-2xl" />,
            title: "Receive Notifications",
            description:
                "निकायले प्रतिक्रिया दिएपछि तुरुन्तै सूचना (एप भित्र, इमेल वा SMS) प्राप्त हुनेछ।",
        },
    ];

    return (
        <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    HamroGunaso कसरी प्रयोग गर्ने?
                </h1>
                <p className="text-lg text-gray-600">
                    तलका चरणहरू पालना गरेर सजिलै गुनासो पेश गर्न सकिन्छ।
                </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 h-full border-l-4 border-blue-600"></div>

                <div className="space-y-10">
                    {steps.map((step, index) => (
                        <div key={index} className="relative pl-16">
                            {/* Icon Circle */}
                            <div className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 shadow-md">
                                {step.icon}
                            </div>

                            {/* Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h2>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
