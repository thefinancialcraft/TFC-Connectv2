import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '../AppLogo';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Team', href: '/leadership' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer scale-90 sm:scale-100 origin-left">
              <Link href="/">
                <AppLogo />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-semibold text-gray-600 hover:text-[#4b33e8] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
               <Link 
                href="/login"
                className="text-sm font-bold text-[#4b33e8] hover:text-[#3b27b8] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-[#4b33e8] hover:bg-[#3b27b8] transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-600 hover:text-[#4b33e8] transition-colors focus:outline-none"
                aria-label="Open Menu"
              >
                <i className="fi fi-rr-menu-burger text-2xl flex"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slider - Right to Left */}
      <div 
        className={`fixed inset-0 z-[60] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sliding Panel */}
        <aside 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full bg-white">
            {/* Header of the slider */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <AppLogo />
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <i className="fi fi-rr-cross text-sm flex"></i>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl text-[#263238] font-bold text-sm hover:bg-gray-50 hover:text-[#4b33e8] transition-all group"
                  >
                    <span>{link.name}</span>
                    <i className="fi fi-rr-angle-small-right text-gray-300 group-hover:text-[#4b33e8] transition-colors"></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-4 text-[#4b33e8] font-bold text-sm bg-white border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all"
              >
                Login to Portal
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-4 bg-[#4b33e8] text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-100 hover:bg-[#3b27b8] transition-all"
              >
                Get Started Now
              </Link>
            </div>
            
            <div className="p-6 text-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 tfc connect</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
