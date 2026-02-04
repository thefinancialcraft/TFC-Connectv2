import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
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
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#263238] mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Stop Managing Spreadsheets. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">
            Start Closing Deals.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The comprehensive SIM-based calling CRM that syncs your mobile workforce with real-time web analytics. Eliminate data chaos and boost agent performance instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link 
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#4b33e8] text-white font-bold text-lg hover:bg-[#3b27b8] transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1"
          >
            Get Started Free
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#263238] border border-gray-200 font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1"
          >
            See How It Works
          </a>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-12 flex items-center justify-center gap-8 text-gray-400 grayscale opacity-60 animate-in fade-in zoom-in duration-1000 delay-500">
          {/* Mock Logos or Stats */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">10k+</span>
            <span className="text-xs font-medium">Active Agents</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">5M+</span>
            <span className="text-xs font-medium">Calls Logged</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">99.9%</span>
            <span className="text-xs font-medium">Uptime</span>
          </div>
        </div>

        {/* Dashboard Preview Mockup Container */}
        <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white/50 backdrop-blur shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 lg:rounded-3xl p-2 sm:p-4">
          {/* Browser Bar Mockup */}
          <div className="h-8 flex items-center gap-2 px-4 border-b border-gray-100 bg-white/80 w-full mb-2 sm:mb-4 rounded-t-lg">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="ml-4 flex-1 h-5 bg-gray-100/50 rounded-md text-[10px] text-gray-400 flex items-center px-3">
              app.rynxly.com/dashboard
            </div>
          </div>
          
          {/* Placeholder for the actual dashboard image */}
          <div className="aspect-[16/9] w-full bg-gray-50 rounded-b-xl relative overflow-hidden group">
            {/* 
               TODO: Replace this div with an actual <img> tag pointing to a screenshot of your dashboard.
               Example: <img src="/assets/dashboard-mockup.png" className="w-full h-full object-cover" />
            */}
            <div className="absolute inset-0 flex items-center justify-center">
                 {/* Abstract visual for now */}
                 <div className="text-center">
                    <p className="text-gray-400 font-medium text-sm mb-2">High-Fidelity Dashboard Interface</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#4b33e8] font-bold text-xs">
                        <i className="fi fi-sr-chart-histogram"></i>
                        Live Analytics Preview
                    </div>
                 </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
