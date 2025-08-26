import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mic, Users, Volume2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Hero: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');
  const [userType, setUserType] = React.useState<'citizen' | 'authority'>('citizen');

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate Nepal map
    tl.fromTo(mapRef.current, 
      { opacity: 0, scale: 0.8 },
      { opacity: 0.1, scale: 1, duration: 1.5, ease: "power3.out" }
    )
    // Animate title
    .fromTo(titleRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=1"
    )
    // Animate subtitle
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    // Animate CTA buttons
    .fromTo(ctaRef.current?.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power3.out" },
      "-=0.3"
    );

    // Continuous wave animation
    gsap.to(waveRef.current, {
      scale: 1.2,
      opacity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Microphone pulse animation
    gsap.to(".mic-pulse", {
      scale: 1.1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }, []);

  const handleCitizenAction = () => {
    if (currentUser) {
      // Navigate to citizen dashboard
      window.location.href = '/dashboard';
    } else {
      setUserType('citizen');
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleAuthorityAction = () => {
    if (currentUser) {
      // Navigate to authority dashboard
      window.location.href = '/authority';
    } else {
      setUserType('authority');
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-red-50 flex items-center justify-center overflow-hidden">
        {/* Top Navigation */}
        <div className="absolute top-6 right-6 z-20">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {currentUser.displayName}</span>
              <button
                onClick={logout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold border border-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setUserType('citizen');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold border border-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>

      {/* Nepal Map Background */}
      <div ref={mapRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 border-4 border-blue-900 opacity-10">
          <svg viewBox="0 0 200 150" className="w-full h-full">
            <path d="M20,20 L180,20 L160,70 L180,120 L20,120 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M20,20 L80,70 L20,120 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Voice Wave Animation */}
      <div ref={waveRef} className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-red-600 opacity-10"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-6 text-red-600 font-inter">
          SunneAawaj
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-blue-900 font-medium">
          Your Voice, Your Right
        </p>
        <p ref={subtitleRef} className="text-lg md:text-xl mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Raise complaints in Nepali speech. Smart routing, AI prioritization, real-time resolution.
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="mic-pulse group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mic, Users, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Hero: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');
  const [userType, setUserType] = React.useState<'citizen' | 'authority'>('citizen');

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(ctaRef.current?.children,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: "power3.out" },
      "-=0.3"
    );

    // Shining effect on title
    gsap.to(titleRef.current, {
      textShadow: "0 0 10px var(--nepal-white), 0 0 20px var(--nepal-white), 0 0 30px var(--nepal-red)",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power2.inOut"
    });

    // Floating effect on buttons
    gsap.to(ctaRef.current?.children, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
      stagger: 0.3
    });

  }, []);

  const handleCitizenAction = () => {
    if (currentUser) {
      window.location.href = '/dashboard';
    } else {
      setUserType('citizen');
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleAuthorityAction = () => {
    if (currentUser) {
      window.location.href = '/authority';
    } else {
      setUserType('authority');
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section ref={heroRef} className="relative min-h-screen bg-[var(--nepal-red)] flex items-center justify-center overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-[var(--nepal-white)]">Welcome, {currentUser.displayName}</span>
              <button
                onClick={logout}
                className="bg-[var(--nepal-white)] text-[var(--nepal-red)] px-4 py-2 rounded-lg font-semibold border border-[var(--nepal-red)] hover:bg-transparent hover:text-[var(--nepal-white)] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setUserType('citizen');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="bg-[var(--nepal-white)] text-[var(--nepal-red)] px-4 py-2 rounded-lg font-semibold border border-[var(--nepal-red)] hover:bg-transparent hover:text-[var(--nepal-white)] transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-6 text-[var(--nepal-white)] font-inter">
          SunneAawaj
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl mb-8 text-[var(--nepal-white)] max-w-3xl mx-auto leading-relaxed">
          Raise complaints in Nepali speech. Smart routing, AI prioritization, real-time resolution.
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button onClick={handleCitizenAction} className="group bg-[var(--nepal-blue)] hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl">
            <Mic className="w-6 h-6 group-hover:animate-pulse" />
            {currentUser ? 'Go to Dashboard' : 'Report a Complaint (Voice)'}
          </button>
          <button onClick={handleAuthorityAction} className="group bg-transparent border-2 border-[var(--nepal-blue)] text-[var(--nepal-white)] hover:bg-[var(--nepal-blue)] hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl">
            <Users className="w-6 h-6" />
            For Authorities
          </button>
        </div>
      </div>

      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        userType={userType}
      />
    </>
  );
};

export default Hero;
          <button className="group bg-transparent border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Users className="w-6 h-6" />
            For Authorities
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-red-600 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-32 right-32 w-6 h-6 bg-blue-900 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-red-600 rounded-full animate-ping opacity-50"></div>
    </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        userType={userType}
      />
    </>
  );
};

export default Hero;