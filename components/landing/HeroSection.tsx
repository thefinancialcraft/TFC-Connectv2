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
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#4b33e8] tracking-wide uppercase">track • call • close</span>
        </div> */}

        {/* Low Opacity Excel Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[400px] z-0 opacity-50 select-none pointer-events-none overflow-hidden [transform:perspective(1000px)_rotateY(15deg)_rotateZ(-6deg)] scale-100 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
          <table className="w-full text-left text-xs text-gray-900 border-collapse">
            <thead>
              <tr className="border-[0.5px] border-blue-300/50">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((col) => (
                  <th key={col} className="px-3 py-2 bg-gray-100/50 border-[0.5px] border-gray-300/50 font-normal text-center w-21">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Rahul Sharma", phone: "98765 43210", status: "Overdue", disp: "Interested", action: "Call Now", time: "10:30 AM", statusColor: "text-red-500" },
                { name: "Priya Singh", phone: "99887 76655", status: "New Lead", disp: "Fresh", action: "First Call", time: "10:45 AM", statusColor: "text-blue-500" },
                { name: "Amit Verma", phone: "91234 56789", status: "Follow Up", disp: "Callback", action: "Reminder", time: "11:00 AM", statusColor: "text-amber-500" },
                { name: "Sneha Gupta", phone: "88990 01122", status: "Closed", disp: "Converted", action: "Onboard", time: "11:15 AM", statusColor: "text-emerald-500" },
                { name: "Vikram Malhotra", phone: "90011 22334", status: "Overdue", disp: "Ringing", action: "Retry", time: "11:30 AM", statusColor: "text-red-500" },
                { name: "Anjali Mehta", phone: "98765 12345", status: "Connected", disp: "Meeting", action: "Zoom Link", time: "12:00 PM", statusColor: "text-purple-500" },
                { name: "Rohit Kumar", phone: "76543 21098", status: "New Lead", disp: "Fresh", action: "First Call", time: "12:15 PM", statusColor: "text-blue-500" },
                { name: "Neha Agarwal", phone: "87654 32109", status: "Follow Up", disp: "Busy", action: "Callback", time: "12:45 PM", statusColor: "text-amber-500" },
                { name: "Suresh Patil", phone: "95678 12340", status: "Closed", disp: "Paid", action: "Invoice", time: "01:00 PM", statusColor: "text-emerald-500" },
                { name: "Kavita Rao", phone: "94321 87654", status: "Overdue", disp: "Switched Off", action: "WhatsApp", time: "01:15 PM", statusColor: "text-red-500" },
                { name: "Arjun Das", phone: "91122 33445", status: "Connected", disp: "Pitching", action: "Send Deck", time: "01:45 PM", statusColor: "text-purple-500" },
                { name: "Meera Iyer", phone: "80099 88776", status: "Follow Up", disp: "Thinking", action: "Nurture", time: "02:00 PM", statusColor: "text-amber-500" },
                { name: "Rajesh Khanna", phone: "99880 07766", status: "Rejected", disp: "Not Interested", action: "Archive", time: "02:15 PM", statusColor: "text-gray-400" },
                { name: "Pooja Reddy", phone: "77665 54433", status: "New Lead", disp: "Fresh", action: "Assign", time: "02:30 PM", statusColor: "text-blue-500" },
                { name: "Varun Nair", phone: "88776 65544", status: "Overdue", disp: "Callback", action: "Urgent", time: "03:00 PM", statusColor: "text-red-500" },
              ].map((row, i) => (
                <tr key={i} className="border-[0.5px] border-gray-300/50">
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 bg-white/50 text-center text-gray-500 font-mono">{i + 1}</td>
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 text-gray-600 font-medium">{row.name}</td>
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 text-gray-400 font-mono text-[10px]">+91 {row.phone}</td>
                  <td className={`px-3 py-1.5 border-[0.5px] border-gray-300/50 ${row.statusColor} font-medium`}>{row.status}</td>
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 text-gray-600">{row.disp}</td>
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 text-gray-600">{row.action}</td>
                  <td className="px-3 py-1.5 border-[0.5px] border-gray-300/50 font-mono text-gray-400">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Main SEO Heading (Hidden for crawlers) */}
        <h1 className="sr-only">The Most Advanced SIM Based Calling CRM for High-Performance Sales Teams</h1>

        {/* Visual Hook Line */}
        <h2 className="relative z-10 mt-10 text-3xl md:text-5xl font-bold tracking-tight text-[#263238] mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Stop Managing Spreadsheets. <br />
          <span className="text-transparent pt-3 pb-2 bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9] inline-block mt-2">
            Start Closing Deals.
          </span>
        </h2>

        {/* Subheadline / Supporting Paragraph */}
        <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The powerful <strong>SIM-based calling CRM</strong> for mobile teams. Automate call logs, sync real-time analytics, and scale your sales without the manual chaos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <a
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4b33e8] text-white font-bold text-base hover:bg-[#3b27b8] transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1"
          >
            Get Started for Free
          </a>
          <a 
            href="#contact"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#263238] border border-gray-200 font-bold text-base hover:bg-gray-50 transition-all hover:-translate-y-1"
          >
            Book a Live Demo
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
