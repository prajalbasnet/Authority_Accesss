import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Mic, Bot, Send, Clock, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const KeyUseCase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: MapPin,
      title: "Select Location",
      description: "User selects their location on an interactive map",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: Mic,
      title: "Voice Complaint",
      description: "Speaks complaint in Nepali: 'Gulmi ma 3 din dekhi batti chaina'",
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Bot,
      title: "AI Classification",
      description: "AI classifies: Category → Electricity | Priority → High",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: Send,
      title: "Smart Routing",
      description: "Complaint routed to appropriate electricity authority",
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Clock,
      title: "Auto Escalation",
      description: "Automatic escalation after 8 hours if unresolved",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: CheckCircle,
      title: "Resolution",
      description: "Authority resolves issue, user marks as 'Solved'",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  useEffect(() => {
    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    
    items?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate connecting lines
      const line = item.querySelector('.connecting-line');
      if (line && index < steps.length - 1) {
        gsap.fromTo(line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "center 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Interactive User Journey</h2>
          <p className="text-xl text-gray-700">Follow the complete complaint resolution process</p>
        </div>

        <div ref={timelineRef} className="relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="timeline-item relative flex items-center mb-12 last:mb-0"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="connecting-line absolute left-8 top-16 w-0.5 h-20 bg-gradient-to-b from-red-300 to-blue-300 origin-top"></div>
                )}
                
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full ${step.bgColor} ${step.borderColor} border-2 flex items-center justify-center mr-6 shadow-lg`}>
                  <IconComponent className={`w-8 h-8 ${step.color}`} />
                </div>
                
                {/* Step Content */}
                <div className={`flex-1 p-6 rounded-lg ${step.bgColor} ${step.borderColor} border shadow-md hover:shadow-lg transition-shadow duration-300`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-gray-500">STEP {index + 1}</span>
                    <h3 className={`text-xl font-bold ${step.color}`}>{step.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${step.color.replace('text-', 'bg-')}`}
                      style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-600">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Complete Resolution in 6 Steps</h3>
          <p className="text-gray-700 leading-relaxed">
            From voice complaint to resolution, our platform ensures transparency, accountability, 
            and efficient public service delivery for all Nepali citizens.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyUseCase;