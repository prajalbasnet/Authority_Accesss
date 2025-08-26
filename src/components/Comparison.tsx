import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, X, CheckCircle, PhoneCall, Smartphone, Clock, MapPin, BarChart3, Bell, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Comparison: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  const traditionalIssues = [
    { icon: PhoneCall, issue: "Calls often go unanswered", color: "text-red-500" },
    { icon: Clock, issue: "No tracking or follow-up", color: "text-red-500" },
    { icon: X, issue: "No accountability measures", color: "text-red-500" },
    { icon: Phone, issue: "Language barriers exist", color: "text-red-500" },
    { icon: BarChart3, issue: "No data or analytics", color: "text-red-500" }
  ];

  const sunneaawajBenefits = [
    { icon: Smartphone, benefit: "Voice-based, always accessible", color: "text-green-500" },
    { icon: MapPin, benefit: "Location-aware smart routing", color: "text-green-500" },
    { icon: BarChart3, benefit: "Complete tracking & analytics", color: "text-green-500" },
    { icon: Bell, benefit: "Auto escalation system", color: "text-green-500" },
    { icon: Shield, benefit: "Transparent accountability", color: "text-green-500" }
  ];

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate scale/balance effect
    tl.fromTo(scaleRef.current,
      { opacity: 0, rotationX: -90 },
      { opacity: 1, rotationX: 0, duration: 1, ease: "power3.out" }
    )
    // Animate left side (problems)
    .fromTo(leftSideRef.current,
      { opacity: 0, x: -100, rotationY: -20 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    )
    // Animate right side (solutions)
    .fromTo(rightSideRef.current,
      { opacity: 0, x: 100, rotationY: 20 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    // Animate individual items
    const leftItems = leftSideRef.current?.querySelectorAll('.comparison-item');
    const rightItems = rightSideRef.current?.querySelectorAll('.comparison-item');

    leftItems?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 1.2 + (index * 0.1),
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    rightItems?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 1.4 + (index * 0.1),
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Add floating animation to the scale
    gsap.to(scaleRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-red-600 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-blue-900 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-red-300 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Why Not Just Call?</h2>
          <p className="text-xl text-gray-700">
            Traditional phone calls vs. SunneAawaj's smart solution
          </p>
        </div>

        {/* Balance Scale Visual */}
        <div ref={scaleRef} className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-32 h-2 bg-gray-400 rounded-full mx-auto mb-4"></div>
            <div className="w-4 h-16 bg-gray-400 rounded-full mx-auto"></div>
            <div className="text-center text-sm text-gray-500 mt-2">Traditional vs Smart</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Traditional Phone Calls - Problems */}
          <div ref={leftSideRef} className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl border-l-4 border-red-500 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-red-600">Traditional Phone Calls</h3>
              </div>
              
              <div className="space-y-4">
                {traditionalIssues.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="comparison-item flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{item.issue}</span>
                      </div>
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-red-200 rounded-lg">
                <p className="text-red-800 font-semibold text-center">
                  ❌ Limited, Inefficient, No Accountability
                </p>
              </div>
            </div>
          </div>

          {/* SunneAawaj - Solutions */}
          <div ref={rightSideRef} className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl border-l-4 border-green-500 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-8 h-8 text-blue-900" />
                <h3 className="text-2xl font-bold text-blue-900">SunneAawaj Platform</h3>
              </div>
              
              <div className="space-y-4">
                {sunneaawajBenefits.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="comparison-item flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{item.benefit}</span>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-green-200 rounded-lg">
                <p className="text-green-800 font-semibold text-center">
                  ✅ Smart, Tracked, Transparent & Accountable
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Comparison Summary */}
        <div className="mt-16 bg-gradient-to-r from-red-50 via-white to-blue-50 p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">The Clear Choice</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
              <p className="text-sm text-gray-600">Reduction in unresolved complaints</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-900 mb-2">3x</div>
              <p className="text-sm text-gray-600">Faster response times</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-sm text-gray-600">Transparency and tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;