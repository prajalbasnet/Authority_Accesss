import React from "react";
import {
  FaUserCheck,
  FaSignInAlt,
  FaClipboardList,
  FaSearch,
  FaBell,
} from "react-icons/fa";

export default function HowToUse() {
  const steps = [
    {
      icon: <FaUserCheck />,
      title: "Sign Up & KYC Verify",
      description:
        "HamroGunaso मा खाता बनाउनुहोस् र KYC प्रमाणिकरण गर्नुहोस्। त्यसपछि मात्र गुनासो पेश गर्न सकिन्छ।",
    },
    {
      icon: <FaSignInAlt />,
      title: "Login to Dashboard",
      description:
        "प्रमाणिकरणपछि लगइन गरी आफ्नो व्यक्तिगत ड्यासबोर्डमा जानुहोस्। त्यहाँ सबै सुविधा प्रयोग गर्न सकिन्छ।",
    },
    {
      icon: <FaClipboardList />,
      title: "Submit Complaint",
      description:
        "ड्यासबोर्डमा 'नयाँ गुनासो' रोज्नुहोस्। सम्बन्धित निकाय छानेर समस्याको विवरण लेखेर पेश गर्नुहोस्।",
    },
    {
      icon: <FaSearch />,
      title: "Track Status",
      description:
        "गुनासो पेश गरेपछि 'मेरो गुनासो' सेक्सनमा गएर गुनासोको स्थिति (पेन्डिङ, प्रगति, समाधान) हेर्न सकिन्छ।",
    },
    {
      icon: <FaBell />,
      title: "Receive Notifications",
      description:
        "निकायले प्रतिक्रिया दिएपछि तुरुन्तै सूचना (एप भित्र, इमेल वा SMS) प्राप्त हुनेछ।",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6 font-poppins">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
          <span className="text-blue-700">Hamro</span><span className="text-red-600">Gunaso</span> कसरी प्रयोग गर्ने?
        </h1>

        <p className="text-lg md:text-xl text-gray-900">
          तलका चरणहरू पालना गरेर सजिलै गुनासो पेश गर्न सकिन्छ।
        </p>
      </div>

      {/* Timeline / Steps */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-gradient-to-b from-red-500 via-blue-600 to-blue-300"></div>

        <div className="space-y-2">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className="relative flex items-center md:justify-between"
              >
                {/* Icon Circle */}
                <div
                  className={`absolute top-0 md:top-2 w-11 ml-2 h-11 flex items-center justify-center rounded-full shadow-lg bg-gradient-to-r from-red-500 via-blue-600 to-blue-300 text-white text-3xl transition-transform duration-300 hover:scale-110`}
                  style={{
                    left: isLeft ? "calc(50% - 2rem)" : "calc(50% - 2rem)",
                    zIndex: 10,
                  }}
                >
                  {step.icon}
                </div>

                {/* Card */}
                <div
                  className={`md:w-5/12 bg-white p-8 rounded-3xl shadow-2xl border-t-4 border-blue-600 transition-transform duration-300 hover:-translate-y-2 hover:shadow-3xl ${isLeft
                    ? "md:mr-auto md:text-right"
                    : "md:ml-auto md:text-left"
                    }`}
                >
                  <h2 className="text-2xl font-bold text-blue-800 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
