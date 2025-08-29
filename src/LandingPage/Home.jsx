import React, { useRef } from 'react';
import HeroSection from '../components/HeroSection';
import About from './About';
import Authorities from './Authorities';
import HowToUse from './HowToUse';
import TermsAndPolicy from './TermsAndPolicy';
import ContactUs from './ContactUs';
import { ScrollProvider } from '../ScrollContext';

function Home() {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const authoritiesRef = useRef(null);
    const howToUseRef = useRef(null);
    const termsRef = useRef(null);
    const contactRef = useRef(null);

    const scrollToSection = {
        '/': () => heroRef.current && heroRef.current.scrollIntoView({ behavior: 'smooth' }),
        '/about': () => aboutRef.current && aboutRef.current.scrollIntoView({ behavior: 'smooth' }),
        '/authorities': () => authoritiesRef.current && authoritiesRef.current.scrollIntoView({ behavior: 'smooth' }),
        '/how-to-use': () => howToUseRef.current && howToUseRef.current.scrollIntoView({ behavior: 'smooth' }),
        '/terms-policy': () => termsRef.current && termsRef.current.scrollIntoView({ behavior: 'smooth' }),
        '/contact': () => contactRef.current && contactRef.current.scrollIntoView({ behavior: 'smooth' }),
    };

    return (
        <ScrollProvider value={{ scrollToSection }}>
            <div>
                <div ref={heroRef}>
                    <HeroSection />
                </div>
                <div ref={aboutRef}>
                    <About />
                </div>
                <div ref={authoritiesRef}>
                    <Authorities />
                </div>
                <div ref={howToUseRef}>
                    <HowToUse />
                </div>
                <div ref={termsRef}>
                    <TermsAndPolicy />
                </div>
                <div ref={contactRef}>
                    <ContactUs />
                </div>
                {/* Scroll to HeroSection Button */}
                <button
                    onClick={scrollToSection['/']}
                    className="fixed bottom-6 right-6 z-50 bg-red-700 hover:bg-red-800 text-white rounded-full shadow-lg p-4 transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>
        </ScrollProvider>
    );
}

export default Home;
