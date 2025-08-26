import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, User, Mic, FileText, Bot, Database, Users, Bell, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ArchitectureFlow: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  const flowSteps = [
    { icon: User, label: "User", color: "bg-red-600" },
    { icon: Mic, label: "Voice", color: "bg-blue-900" },
    { icon: FileText, label: "STT", color: "bg-red-600" },
    { icon: Bot, label: "NLP Classifier", color: "bg-blue-900" },
    { icon: Database, label: "Database", color: "bg-red-600" },
    { icon: Users, label: "Authority", color: "bg-blue-900" },
    { icon: Bell, label: "Alerts", color: "bg-red-600" },
    { icon: CheckCircle, label: "Response", color: "bg-blue-900" }
  ];

  useEffect(() => {
    const steps = flowRef.current?.querySelectorAll('.flow-step');
    const arrows = flowRef.current?.querySelectorAll('.flow-arrow');

    // Animate steps
    gsap.fromTo(steps,
      { opacity: 0, scale: 0, rotationY: 180 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: flowRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate arrows with stroke effect
    arrows?.forEach((arrow, index) => {
      const path = arrow.querySelector('path');
      if (path) {
        const pathLength = (path as SVGPathElement).getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: arrow,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }
    });

    // Add floating animation to steps
    steps?.forEach((step, index) => {
      gsap.to(step, {
        y: -10,
        duration: 2 + (index * 0.2),
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">System Architecture</h2>
          <p className="text-xl text-gray-700">
            Complete data flow from voice input to resolution
          </p>
        </div>

        <div ref={flowRef} className="relative">
          {/* Desktop Flow */}
          <div className="hidden lg:flex items-center justify-between">
            {flowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className="flow-step flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center shadow-lg mb-3`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{step.label}</span>
                  </div>
                  
                  {index < flowSteps.length - 1 && (
                    <div className="flow-arrow">
                      <svg width="60" height="30" viewBox="0 0 60 30" className="text-red-600">
                        <path
                          d="M5 15 L45 15 M40 10 L45 15 L40 20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-8">
            {flowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flow-step flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-full ${step.color} text-white flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{step.label}</h3>
                    <div className="w-full h-1 bg-gradient-to-r from-red-300 to-blue-300 rounded-full mt-2"></div>
                  </div>
                  
                  {index < flowSteps.length - 1 && (
                    <div className="flow-arrow ml-6">
                      <svg width="30" height="40" viewBox="0 0 30 40" className="text-red-600">
                        <path
                          d="M15 5 L15 30 M10 25 L15 30 L20 25"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-red-600 mb-3">Input Processing</h3>
            <p className="text-gray-700 text-sm">
              Advanced Speech-to-Text with Nepali language support and NLP classification
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-900">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Smart Routing</h3>
            <p className="text-gray-700 text-sm">
              Location-based authority mapping with priority-based queue management
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-red-600 mb-3">Multi-channel Alerts</h3>
            <p className="text-gray-700 text-sm">
              SMS, Email, and App notifications with automatic escalation system
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureFlow;