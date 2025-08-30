import React, { useState } from "react";

export default function TermsPolicyLegal() {
  const [lang, setLang] = useState("np");

  const cases = {
    np: [
      {
        title: "मामला १: गलत वा भ्रामक जानकारी दिनु",
        detail:
          "यदि प्रयोगकर्ताले जानाजानी गलत वा भ्रामक गुनासो पेश गर्छ भने सम्बन्धित निकायलाई झुक्याउने वा भ्रम फैलाउने कार्य मानिन्छ।",
        punishment:
          "डिजिटल ठगीसम्बन्धी कानून अनुसार कारबाही हुनेछ (जरीवाना वा कैद सजाय) — साइबर अपराध ऐन धारा 23।",
      },
      {
        title: "मामला २: फर्जी गुनासो वा जघन्य दुव्र्यवहार",
        detail:
          "यदि प्रयोगकर्ताले अराजकता, विवाद वा अनावश्यक झगडा गर्न गुनासो प्रणाली दुरुपयोग गर्छ भने।",
        punishment:
          "यो कार्य सार्वजनिक हित विरुद्ध मानिने भएकाले प्रशासनिक सजाय हुनेछ — स्थानीय प्रशासन ऐन धारा 12।",
      },
      {
        title: "मामला ३: अरूको कागजात प्रयोग गरेर KYC",
        detail:
          "अरूको नागरिकता, लाइसेन्स, पासपोर्ट, मतदाता परिचयपत्र वा अन्य सरकारी कागजात प्रयोग गरेर KYC प्रमाणिकरण गर्ने प्रयास।",
        punishment:
          "यो ठगी र नक्कली कागजात मुद्दा अन्तर्गत पर्दछ — दफा 17 अनुसार कैद वा जरिवाना।",
      },
      {
        title: "मामला ४: फर्जी वा चोरी गरिएका कागजात प्रयोग",
        detail:
          "नक्कली वा चोरी गरिएका कागजात प्रयोग गरेर खाता खोल्ने वा KYC प्रमाणित गर्ने प्रयास।",
        punishment:
          "यो कार्य दस्तावेज दुरुपयोग मुद्दा अन्तर्गत पर्दछ — अधिकतम ५ वर्ष कैद वा आर्थिक जरिवाना।",
      },
      {
        title: "मामला ५: निकाय वा व्यक्तिको प्रतिष्टामा आँच पुर्याउने",
        detail:
          "HamroGunaso प्रणाली प्रयोग गरी कुनै निकाय वा व्यक्तिलाई बदनाम गर्ने वा गलत सूचना फैलाउने।",
        punishment:
          "यो कार्य कानूनी अपराध मानिनेछ र मानहानि सम्बन्धी मुद्दा लाग्नेछ — मुलुकी फौजदारी संहिता धारा 305।",
      },
      {
        title: "मामला ६: अनधिकृत पहुँच",
        detail:
          "प्रयोगकर्ताले अरूको खाता वा प्रणालीमा अनधिकृत प्रवेश गर्ने वा प्रयास गर्ने।",
        punishment:
          "यो कार्य साइबर अपराध मानिनेछ — धारा 27 अनुसार कैद र जरिवाना दुवै हुन सक्छ।",
      },
      {
        title: "मामला ७: व्यक्तिगत गोपनीयता उल्लंघन",
        detail:
          "अन्य प्रयोगकर्ताको व्यक्तिगत विवरण बिना अनुमति प्रयोग गर्ने वा सार्वजनिक गर्ने।",
        punishment: "गोपनीयता ऐन अन्तर्गत मुद्दा चलाइनेछ — जरिवाना वा कारावास।",
      },
      {
        title: "मामला ८: खाता दुरुपयोग",
        detail:
          "HamroGunaso खाता प्रयोग गरी आर्थिक ठगी, हैकिंग, वा अन्य अवैध कार्य गर्ने।",
        punishment:
          "यो साइबर अपराध अन्तर्गत पर्दछ — दफा 29 अनुसार कारबाही हुने।",
      },
    ],
    en: [
      {
        title: "Case 1: Providing False or Misleading Information",
        detail:
          "If a user knowingly submits false or misleading complaints to misguide authorities.",
        punishment:
          "Punishable under Digital Fraud Law (fine or imprisonment) — Cybercrime Act, Section 23.",
      },
      {
        title: "Case 2: Fake Complaints or Abusive Behavior",
        detail:
          "If a user abuses the complaint system to create unnecessary disputes or conflicts.",
        punishment:
          "This is against public interest and administrative penalties will apply — Local Administration Act, Section 12.",
      },
      {
        title: "Case 3: Using Someone Else’s Documents for KYC",
        detail:
          "Attempting KYC verification using another person’s Citizenship, License, Passport, or Voter ID.",
        punishment:
          "Falls under Fraud and Forgery — Section 17 (Imprisonment or fine).",
      },
      {
        title: "Case 4: Using Forged or Stolen Documents",
        detail:
          "Using fake or stolen documents to create accounts or verify identity.",
        punishment:
          "Falls under document misuse law — up to 5 years imprisonment or fine.",
      },
      {
        title: "Case 5: Defaming Authorities or Individuals",
        detail:
          "Using HamroGunaso to defame, insult, or spread false information against any authority or individual.",
        punishment:
          "Considered a legal offense — Defamation Law, Criminal Code Section 305.",
      },
      {
        title: "Case 6: Unauthorized Access",
        detail:
          "Attempting to gain unauthorized access into another user’s account or system.",
        punishment:
          "This is cybercrime — Cybercrime Act, Section 27 (Fine and/or imprisonment).",
      },
      {
        title: "Case 7: Violation of Privacy",
        detail:
          "Collecting, sharing, or misusing personal data of other users without consent.",
        punishment: "Punishable under Privacy Act (fine or imprisonment).",
      },
      {
        title: "Case 8: Misuse of Account",
        detail:
          "Using HamroGunaso accounts for fraud, hacking, or illegal activities.",
        punishment: "Punishable under Cybercrime Act, Section 29.",
      },
    ],
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-red-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {lang === "np" ? (
              <>
                <span className="text-blue-700">Hamro</span><span className="text-red-600">Gunaso</span>  नियम तथा नीति
              </>
            ) : (
              <>
                <span className="text-blue-700">Hamro</span><span className="text-red-600">Gunaso</span>  Terms & Policy
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            {lang === "np"
              ? "HamroGunaso प्रयोग गर्दा तलका कानूनी नियम तथा नीति पालना गर्नुपर्छ।"
              : "Users must comply with the following legal terms and policies while using HamroGunaso."}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setLang("np")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              lang === "np"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            नेपाली
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              lang === "en"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            English
          </button>
        </div>

        {/* Cases */}
        <div className="space-y-6">
          {cases[lang].map((c, i) => (
            <div
              key={i}
              className="bg-white border-l-8 border-blue-600 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {c.title}
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed">{c.detail}</p>
              <p className="text-red-600 font-semibold">
                {lang === "np" ? "सजाय: " : "Punishment: "} {c.punishment}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
