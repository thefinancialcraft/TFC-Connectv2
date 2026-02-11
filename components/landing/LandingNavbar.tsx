import Link from 'next/link';
import AppLogo from '../AppLogo';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer scale-90 origin-left">
            <Link href="/">
              <AppLogo />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#4b33e8] transition-colors">Home</Link>
            <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-[#4b33e8] transition-colors">Features</Link>
            <a href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#4b33e8] transition-colors">How it Works</a>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-[#4b33e8] transition-colors">Pricing</Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-[#4b33e8] transition-colors">FAQ</Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
             <Link 
              href="/login"
              className="text-sm font-bold text-[#4b33e8] hover:text-[#3b27b8] transition-colors hidden sm:block"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-bold rounded-full text-white bg-[#4b33e8] hover:bg-[#3b27b8] transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
