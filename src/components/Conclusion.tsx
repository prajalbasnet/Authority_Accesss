import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Users, ArrowRight, Heart, Star, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Conclusion: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(ctaRef.current?.children,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.7)" },
      "-=0.3"
    )
    .fromTo(footerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.2"
    );

    // Continuous floating animation for icons
    gsap.to(".floating-icon", {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.3
    });

    // Pulse animation for CTA buttons
    gsap.to(".cta-pulse", {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-blue-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-20 right-32 w-20 h-20 border-2 border-white rounded-full"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Mic className="floating-icon absolute top-32 left-1/4 w-8 h-8 text-white opacity-20" />
        <Users className="floating-icon absolute bottom-32 right-1/4 w-8 h-8 text-white opacity-20" />
        <Globe className="floating-icon absolute top-1/2 left-20 w-8 h-8 text-white opacity-20" />
        <Heart className="floating-icon absolute top-20 right-1/3 w-8 h-8 text-white opacity-20" />
        <Star className="floating-icon absolute bottom-20 left-1/3 w-8 h-8 text-white opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Title */}
        <h2 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-8">
          SunneAawaj
        </h2>
        
        {/* Subtitle */}
        <p ref={subtitleRef} className="text-2xl md:text-3xl mb-4 font-medium">
          Bringing Inclusive Digital Governance to Nepal
        </p>
        
        <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
          Empowering every Nepali citizen with voice-powered technology to ensure their concerns 
          are heard, tracked, and resolved with complete transparency and accountability.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="cta-pulse group bg-white text-red-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 transform hover:-translate-y-2">
            <Mic className="w-7 h-7 group-hover:animate-pulse" />
            Get Started (Citizen)
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          
          <button className="group bg-transparent border-3 border-white text-white hover:bg-white hover:text-red-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 transform hover:-translate-y-2">
            <Users className="w-7 h-7" />
            Join as Authority
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Key Features Summary */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <Mic className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Voice-First</h3>
            <p className="text-sm opacity-90">Nepali speech recognition for all citizens</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <Globe className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Smart Routing</h3>
            <p className="text-sm opacity-90">AI-powered location-based authority mapping</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Transparent</h3>
            <p className="text-sm opacity-90">Complete tracking and accountability</p>
          </div>
        </div>

        {/* Final Message */}
        <div className="max-w-4xl mx-auto mb-12">
          <blockquote className="text-xl md:text-2xl font-medium italic opacity-90 mb-6">
            "Your voice matters. Your concerns deserve action. Your rights deserve protection."
          </blockquote>
          <div className="w-32 h-1 bg-white mx-auto rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Footer with Nepal Flag Stripe */}
      <div ref={footerRef} className="relative">
        <div className="h-16 bg-gradient-to-r from-red-600 via-blue-900 to-red-600 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-red-600 border border-white"></div>
              <div className="w-4 h-4 bg-blue-900 border border-white"></div>
            </div>
            <span className="text-white font-semibold">Made with ❤️ for Nepal</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-900 border border-white"></div>
              <div className="w-6 h-4 bg-red-600 border border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conclusion;