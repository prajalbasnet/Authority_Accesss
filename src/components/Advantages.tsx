import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  Globe,
  Shield,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Advantages: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);

  const advantages = [
    "Inclusive access for all literacy levels",
    "Nepali language support with voice recognition",
    "Real-time complaint tracking and updates",
    "Transparent authority accountability system",
    "Location-based intelligent routing",
    "Multi-channel alert and notification system",
    "Automatic escalation for unresolved issues",
    "Comprehensive dashboard for all stakeholders",
  ];

  const stats = [
    {
      number: 1000,
      suffix: "+",
      label: "Complaints Resolved",
      icon: CheckCircle,
    },
    { number: 6, suffix: "", label: "Authority Categories", icon: Users },
    { number: 24, suffix: "/7", label: "Tracking & Escalation", icon: Clock },
    {
      number: 99,
      suffix: "%",
      label: "Citizen Satisfaction",
      icon: TrendingUp,
    },
  ];

  useEffect(() => {
    // Early return if refs are not available
    if (!statsRef.current || !checklistRef.current) return;

    // Animate stats with count-up effect
    const statNumbers = statsRef.current?.querySelectorAll(".stat-number");
    statNumbers?.forEach((stat, index) => {
      const targetNumber = stats[index].number;
      const obj = { value: 0 };
      gsap.to(obj, {
        value: targetNumber,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          if (stat) {
            stat.textContent = Math.round(obj.value).toString();
          }
        },
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Animate checklist items
    const checkItems = checklistRef.current?.querySelectorAll(".check-item");
    if (checkItems && checkItems.length > 0) {
      gsap.fromTo(
        checkItems,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: checklistRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animate stat cards
    const statCards = statsRef.current?.querySelectorAll(".stat-card");
    if (statCards && statCards.length > 0) {
      gsap.fromTo(
        statCards,
        { opacity: 0, y: 80, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">
            Platform Advantages
          </h2>
          <p className="text-xl text-gray-700">
            Transforming public service delivery with transparency and
            accountability
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Advantages Checklist */}
          <div ref={checklistRef} className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              Why Choose SunneAawaj?
            </h3>
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="check-item flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{advantage}</span>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div ref={statsRef} className="space-y-8">
            <h3 className="text-2xl font-bold text-red-600 mb-6">
              Platform Impact
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="stat-card bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent
                        className={`w-8 h-8 ${
                          index % 2 === 0 ? "text-red-600" : "text-blue-900"
                        }`}
                      />
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${
                            index % 2 === 0 ? "text-red-600" : "text-blue-900"
                          }`}
                        >
                          <span className="stat-number">0</span>
                          <span>{stat.suffix}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <div
                      className={`w-full h-1 rounded-full mt-2 ${
                        index % 2 === 0 ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <div
                        className={`h-1 rounded-full w-full ${
                          index % 2 === 0 ? "bg-red-600" : "bg-blue-900"
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Benefits */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Key Benefits
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-900" />
                  <span className="text-sm text-gray-600">
                    Language Inclusive
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">
                    Secure & Private
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-900" />
                  <span className="text-sm text-gray-600">
                    Efficiency Boost
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">
                    Community Driven
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl italic text-gray-700 max-w-4xl mx-auto">
            "SunneAawaj bridges the digital divide, ensuring every Nepali
            citizen's voice is heard and every complaint reaches the right
            authority for swift resolution."
          </blockquote>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-red-600 to-blue-900 mx-auto rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
