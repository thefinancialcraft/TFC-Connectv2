import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-[#4b33e8] mb-4 tracking-tight">
              rynxly.
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The ultimate SIM-based calling CRM for high-performance sales teams.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#4b33e8] hover:text-white transition-all">
                <i className="fi fi-brands-twitter text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#4b33e8] hover:text-white transition-all">
                <i className="fi fi-brands-linkedin text-sm"></i>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#4b33e8] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
