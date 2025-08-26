import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, FileText, Bot, MapPin, BarChart3, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Mic,
      title: "Voice-based Complaint",
      description: "Submit complaints using natural Nepali speech without typing",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100"
    },
    {
      icon: FileText,
      title: "Speech-to-Text Conversion",
      description: "Advanced AI converts Nepali speech to accurate text format",
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: Bot,
      title: "AI Classification",
      description: "Smart categorization and priority assignment using machine learning",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100"
    },
    {
      icon: MapPin,
      title: "Location-based Routing",
      description: "Automatic routing to relevant authorities based on geographic location",
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: BarChart3,
      title: "Real-time Dashboards",
      description: "Comprehensive dashboards for both authorities and citizens",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100"
    },
    {
      icon: Bell,
      title: "Auto Escalation & Alerts",
      description: "Automatic escalation with multi-channel reminder system",
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    }
  ];

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.feature-card');
    
    gsap.fromTo(cards,
      { opacity: 0, y: 80, rotationX: -15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Add hover animations to each card
    cards?.forEach((card) => {
      const icon = card.querySelector('.feature-icon');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, { scale: 1.2, rotation: 5, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(card, { y: -8, duration: 0.3, ease: "power2.out" });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Platform Features</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Comprehensive tools designed to bridge the digital divide and ensure effective public service delivery
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`feature-card p-8 rounded-xl ${feature.bgColor} ${feature.hoverColor} border border-gray-100 shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className={`feature-icon w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg`}>
                  <IconComponent className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className={`text-xl font-bold mb-4 ${feature.color}`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative Element */}
                <div className="mt-6 w-full h-1 bg-gradient-to-r from-red-300 to-blue-300 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-50 to-blue-50 px-8 py-4 rounded-full border border-red-200">
            <Mic className="w-6 h-6 text-red-600 animate-pulse" />
            <span className="text-lg font-semibold text-gray-800">Ready to experience voice-powered governance?</span>
            <Bot className="w-6 h-6 text-blue-900 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;