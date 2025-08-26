import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Users, FileText, Clock, Shield, Upload } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AuthorityManagement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(leftPanelRef.current,
      { opacity: 0, x: -100, rotationY: -15 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(rightPanelRef.current,
      { opacity: 0, x: 100, rotationY: 15 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out" },
      "-=0.7"
    );

    // Animate dashboard elements
    const dashboardItems = leftPanelRef.current?.querySelectorAll('.dashboard-item');
    dashboardItems?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 1 + (index * 0.1),
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Platform Management</h2>
          <p className="text-xl text-gray-700">
            Comprehensive tools for authorities and secure citizen verification
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Authority Panel */}
          <div ref={leftPanelRef} className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-8 h-8 text-blue-900" />
                <h3 className="text-2xl font-bold text-blue-900">Authority Dashboard</h3>
              </div>
              
              <div className="space-y-4">
                <div className="dashboard-item bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Pending Complaints</span>
                    <span className="text-2xl font-bold text-red-600">24</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>

                <div className="dashboard-item bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Resolved Today</span>
                    <span className="text-2xl font-bold text-green-600">18</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>

                <div className="dashboard-item bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Response Time</span>
                    <span className="text-2xl font-bold text-blue-900">2.4h</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-900 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200">
                  View All
                </button>
                <button className="flex-1 bg-white text-blue-900 py-2 px-4 rounded-lg font-semibold border border-blue-900 hover:bg-blue-50 transition-colors duration-200">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <Clock className="w-8 h-8 text-red-600 mb-2" />
                <p className="text-sm font-medium text-red-800">Real-time Updates</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Users className="w-8 h-8 text-blue-900 mb-2" />
                <p className="text-sm font-medium text-blue-900">Multi-Authority</p>
              </div>
            </div>
          </div>

          {/* Citizen Verification Panel */}
          <div ref={rightPanelRef} className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-lg border border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-red-600">Citizen Verification</h3>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-red-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Upload Citizenship Card</h4>
                  <p className="text-sm text-gray-600 mb-4">Secure verification using Nepal Citizenship Card</p>
                  <button className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                    Upload Document
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  OCR-based automatic data extraction
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Government database verification
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Privacy-compliant secure storage
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
                <FileText className="w-8 h-8 text-red-600 mb-2" />
                <p className="text-sm font-medium text-gray-800">Document Security</p>
                <p className="text-xs text-gray-600 mt-1">End-to-end encryption</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-900">
                <Shield className="w-8 h-8 text-blue-900 mb-2" />
                <p className="text-sm font-medium text-gray-800">Identity Verification</p>
                <p className="text-xs text-gray-600 mt-1">Government validated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-xl border border-gray-200">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Secure, Transparent, and Accountable
            </p>
            <p className="text-gray-600">
              Complete audit trail and privacy protection for all stakeholders
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorityManagement;