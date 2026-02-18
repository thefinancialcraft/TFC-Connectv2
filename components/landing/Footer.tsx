import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-[#4b33e8] mb-2 tracking-tight">
              rynxly.
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Rynxly is the #1 **SIM based calling CRM** designed for high-performance sales teams. Track calls, manage leads, and sync mobile data effortlessly with our advanced **sales calling software**.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/_rynxly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#E1306C] hover:text-white transition-all">
                <i className="fi fi-brands-instagram flex text-sm"></i>
              </a>
              <a href="https://www.linkedin.com/company/rynxly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0077b5] hover:text-white transition-all">
                <i className="fi fi-brands-linkedin flex text-sm"></i>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/blog" className="hover:text-[#4b33e8] transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-[#4b33e8] transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/team" className="hover:text-[#4b33e8] transition-colors">Team & Leadership</Link></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Careers</a></li>
              <li><Link href="/contact" className="hover:text-[#4b33e8] transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {currentYear} Rynxly. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
