import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, Target, Users, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProblemObjective: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(leftRef.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(rightRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Illustration */}
          <div ref={leftRef} className="relative">
            <div ref={imageRef} className="bg-gradient-to-br from-blue-50 to-red-50 p-8 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-16 h-16 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="w-full h-2 bg-red-200 rounded-full mb-4">
                    <div className="h-full w-3/4 bg-red-600 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"Gulmi ma 3 din dekhi batti chaina..."</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-900 font-medium">
                  <Users className="w-4 h-4" />
                  Elderly Nepali Citizen Speaking
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div ref={rightRef} className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-red-600">Problem Statement</h2>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
                <p className="text-gray-700 leading-relaxed">
                  Many Nepali citizens, especially elderly and those in remote areas, struggle with digital literacy. 
                  They cannot effectively use online complaint systems, leading to unaddressed public service issues 
                  and lack of accountability from authorities.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-900" />
                <h2 className="text-3xl font-bold text-blue-900">Our Objective</h2>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-900">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Create an inclusive, voice-based platform that allows citizens to report complaints in Nepali, 
                  with intelligent routing, priority classification, and transparent tracking.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    Bridge the digital divide through voice technology
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    Ensure accountability and transparency
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    Improve public service delivery efficiency
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemObjective;