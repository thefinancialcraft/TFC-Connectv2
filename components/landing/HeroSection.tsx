import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate how much of the section is visible or its position
        // We want a value that represents progress through the top part of the page
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic width based on scroll
  // Starts at max-w-4xl (896px) and expands as you scroll
  const dynamicWidth = Math.min(980, 796 + (scrollY * 0.25)); 

  return (
    <div className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#4b33e8] tracking-wide uppercase">New v2.0 Live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#263238] mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Stop Managing Spreadsheets. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9] inline-block mt-2">
            Start Closing Deals.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The comprehensive SIM-based calling CRM that syncs your mobile workforce with real-time web analytics. Eliminate data chaos and boost agent performance instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link 
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4b33e8] text-white font-bold text-base hover:bg-[#3b27b8] transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1"
          >
            Get Started Free
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#263238] border border-gray-200 font-bold text-base hover:bg-gray-50 transition-all hover:-translate-y-1"
          >
            See How It Works
          </a>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-gray-400 grayscale opacity-60 animate-in fade-in zoom-in duration-1000 delay-500">
          {/* Mock Logos or Stats */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-800">500+</span>
            <span className="text-xs font-medium">Active Agents</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-800">5M+</span>
            <span className="text-xs font-medium">Calls Logged</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-800">99.9%</span>
            <span className="text-xs font-medium">Uptime</span>
          </div>
        </div>

        {/* Dashboard Preview Mockup Container with Scroll Effect (Width/Height expansion) */}
        <div 
          ref={sectionRef}
          style={{ 
            maxWidth: `${dynamicWidth}px`,
            transition: 'max-width 0.2s ease-out'
          }}
          className="mt-16 relative mx-auto w-full rounded-2xl border border-gray-200 bg-white/50 backdrop-blur shadow-2xl overflow-hidden lg:rounded-3xl cursor-pointer shadow-indigo-100/20"
        >
          {/* Browser Bar Mockup */}
          <div className="h-8 flex items-center gap-2 px-4 border-b border-gray-100 bg-white/80 w-full rounded-t-lg">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="ml-4 flex-1 h-5 bg-gray-100/50 rounded-md text-[10px] text-gray-400 flex items-center px-3">
              www.rynxly.in/dashboard
            </div>
          </div>
          
          {/* Placeholder for the actual dashboard image */}
          {/* Actual screenshot of the dashboard/call interface */}
          <div className="w-full bg-white rounded-b-xl relative overflow-hidden">
            <img 
              src="/call-interface-desktop.png" 
              alt="Rynxly Call Interface" 
              className="w-full h-auto block"
            />
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
