import { useRef, useEffect, useState } from 'react';

export default function ReminderShowcase() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Interactive Slider State
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<number>(0);
  const mobileSwipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle Dragging
  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartRef.current = clientX - swipeX;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      let diff = clientX - dragStartRef.current;
      
      // Constraints (Increased to allow sliding all the way to edges)
      if (diff < -100) diff = -100;
      if (diff > 100) diff = 100;
      
      setSwipeX(diff);
    };

    const onEnd = () => {
      setIsDragging(false);
      // Spring back effect with a slight bounce
      if (Math.abs(swipeX) < 90) {
        setTimeout(() => {
          setSwipeX(0);
        }, 10);
      } else {
        // If they swiped all the way, stay there briefly then reset or just reset
        setTimeout(() => {
          setSwipeX(0);
        }, 500);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              Smart Recall System
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Intelligence <span className="text-[#4b33e8]">In Every Reminder</span>
            </h2>
            <p className="text-sm text-gray-500 mb-10 leading-relaxed max-w-lg">
              Don't just set alarms—deploy a decision engine. Rynxly's smart reminders prioritize your high-value callbacks based on urgency, lead potential, and your current activity.
            </p>

            <ul className="space-y-6">
              {[
                { 
                  title: "Google Dialer Style Swipe", 
                  desc: "Intuitive swipe-to-action on mobile. Swipe right to call, left to dismiss, or tap to snooze.",
                  icon: "fi-rr-clapperboard-play"
                },
                { 
                  title: "3-Minute Priority Rule", 
                  desc: "Busy? The system intelligently waits 3 minutes before prompting the next urgent call.",
                  icon: "fi-rr-clock-three"
                },
                { 
                  title: "Conflict Protection", 
                  desc: "Avoid double-booking. The CRM checks your existing schedule before letting you snooze.",
                  icon: "fi-rr-shield-check"
                }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <i className={`fi ${item.icon} text-[#4b33e8] text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dual Mockup */}
          <div className={`relative h-[550px] md:h-[650px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Desktop Dashboard Mockup */}
            <div className="absolute top-0 right-0 w-[85%] md:w-[90%] aspect-[16/10] rounded-2xl border border-gray-200 bg-slate-50 shadow-2xl overflow-hidden z-10 group transition-all duration-500">
               {/* Browser Header */}
               <div className="h-6 bg-white border-b border-gray-100 flex items-center gap-1.5 px-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-60"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60"></div>
               </div>
               
               <div className="relative p-4 flex gap-4 h-full">
                 {/* Sidebar Mock */}
                 <div className="w-12 space-y-3 opacity-20">
                    <div className="w-full h-8 bg-indigo-600 rounded-lg"></div>
                    <div className="w-full h-6 bg-gray-300 rounded-lg"></div>
                    <div className="w-full h-6 bg-gray-300 rounded-lg"></div>
                    <div className="w-full h-6 bg-gray-300 rounded-lg"></div>
                 </div>
                 {/* Content Mock */}
                 <div className="flex-1 space-y-4 opacity-10">
                    <div className="w-1/3 h-6 bg-gray-400 rounded"></div>
                    <div className="grid grid-cols-4 gap-4">
                       {[1,2,3,4].map(i => <div key={i} className="aspect-video bg-gray-200 rounded-xl"></div>)}
                    </div>
                    <div className="w-full h-32 bg-gray-100 rounded-xl"></div>
                 </div>

                 {/* 🖥️ DESKTOP FLOATING REMINDER (AS PER IMAGE) */}
                 <div className="absolute top-4 right-4 w-56 bg-[#1a1f24] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-3 border border-white/10 z-30 transform hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                              <i className="fi fi-sr-bell text-white text-[10px]"></i>
                           </div>
                           <div>
                              <p className="text-white text-[10px] font-bold leading-none">Afsar Ali</p>
                              <p className="text-emerald-500 text-[7px] font-black uppercase tracking-tighter mt-1">CAMPAIGN : TEST</p>
                           </div>
                        </div>
                        <i className="fi fi-rr-cross text-white/30 text-[8px] cursor-pointer"></i>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {['CALL BACK', 'INTERESTED', 'NOT SURE'].map(t => (
                           <span key={t} className="px-1.5 py-0.5 rounded-[3px] bg-slate-800 text-white/40 text-[6px] font-bold border border-white/5">{t}</span>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-white/40 text-[7px] mb-2 px-1">
                       <i className="fi fi-rr-clock-three mt-0.5"></i>
                       <span>10/02/2026, 11:10</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-[7px] mb-3 px-1">
                       <i className="fi fi-rr-document mt-0.5"></i>
                       <span className="italic">"call back me later"</span>
                    </div>

                    <button className="w-full h-8 bg-emerald-500 rounded-lg flex items-center justify-center gap-2 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors mb-2 shadow-lg shadow-emerald-500/20">
                       <i className="fi fi-rr-phone-call mt-0.5"></i>
                       CALL NOW
                    </button>

                    <div className="flex justify-between gap-1">
                       {['+5M', '+10M', '+15M'].map(m => (
                          <div key={m} className="flex-1 h-5 bg-slate-800/80 rounded-md border border-white/5 flex items-center justify-center text-[7px] text-white/80 font-bold hover:bg-slate-700 transition-colors cursor-pointer">{m}</div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>

            {/* 📱 MOBILE REMINDER MOCKUP (AS PER IMAGE) - INCREASED WIDTH */}
            <div className="absolute bottom-4 left-0 w-[58%] md:w-[48%] aspect-[9/18] rounded-[2rem] border-[8px] border-slate-900 bg-[#121826] shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden z-40 transform hover:scale-105 transition-transform duration-500">
               {/* Internal Content */}
               <div className="h-full flex flex-col items-center pt-8 px-3 pb-14 relative">
                 {/* Top Badge */}
                 <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-8 mt-2 flex items-center gap-2">
                    <i className="fi fi-rr-calendar-clock text-[8px] text-white/40"></i>
                    <span className="text-[7px] font-bold text-white/60 tracking-wider">EXP: 10/02/2026</span>
                 </div>

                 {/* Avatar Group */}
                 <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 border-4 border-slate-700/30 flex items-center justify-center relative z-10">
                       <span className="text-3xl font-bold text-white/90">A</span>
                    </div>
                    {/* Ring Animations */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-blue-500/20 animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-blue-500/10 animate-[ping_3s_infinite_1s]"></div>
                 </div>

                 <h3 className="text-white text-lg font-black mb-1 tracking-tight">Afsar Ali</h3>
                 <p className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] mb-4">TEST</p>

                 {/* Disposition Chips */}
                 <div className="flex gap-1.5 mb-6">
                    <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-300 text-[6px] font-black rounded border border-blue-500/20">CALL BACK</span>
                    <span className="px-1.5 py-0.5 bg-indigo-600/20 text-indigo-300 text-[6px] font-black rounded border border-indigo-500/20">INTERESTED</span>
                    <span className="px-1.5 py-0.5 bg-emerald-600/10 text-emerald-400/80 text-[6px] font-black rounded border border-emerald-500/10">NOT SURE</span>
                 </div>

                 {/* Floating Quote Box */}
                 <div className="w-full py-2 bg-white/5 rounded-xl border border-white/5 mb-4 text-center px-4 relative">
                    <p className="text-white/80 text-[8px] italic font-medium">"call back me later"</p>
                 </div>

                 {/* Time Display */}
                 <div className="flex items-center gap-2 text-white/40 text-[8px] font-bold mb-auto">
                    <i className="fi fi-rr-clock-three"></i>
                    <span>10 Feb 2026, 11:10</span>
                 </div>

                 {/* Snooze Row */}
                 <div className="w-full flex items-center justify-between px-2 mb-2">
                    <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">SNOOZE</span>
                    <div className="flex gap-1.5">
                       {['+5m', '+10m', '+15m'].map(m => (
                          <div key={m} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[7px] font-bold text-white cursor-default">{m}</div>
                       ))}
                    </div>
                 </div>

                  {/* The Slider (Main Action - FULLY INTERACTIVE) */}
                  <div className="w-full h-10 rounded-full bg-slate-800/90 border border-slate-700/50 shadow-2xl flex items-center justify-between px-7 relative mt-auto touch-none select-none">
                    
                    {/* Inner Clipped Area for Labels & Color Hints */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        {/* Dynamic Background Hints */}
                        <div 
                           className="absolute inset-0 transition-opacity duration-300"
                           style={{ 
                              background: swipeX > 0 
                                 ? `linear-gradient(90deg, transparent 50%, rgba(16, 185, 129, ${Math.min(0.4, swipeX/100)}) 100%)`
                                 : swipeX < 0 
                                    ? `linear-gradient(-90deg, transparent 50%, rgba(239, 68, 68, ${Math.min(0.4, Math.abs(swipeX)/100)}) 100%)`
                                    : 'transparent'
                           }}
                        />

                        {/* Labels */}
                        <div className="absolute inset-0 flex items-center justify-between px-10 text-[8px] font-black uppercase tracking-widest transition-all duration-300">
                            <span className={swipeX < -60 ? 'text-red-400 opacity-100' : 'text-slate-400 opacity-40'}>Dismiss</span>
                            <span className={swipeX > 60 ? 'text-emerald-400 opacity-100' : 'text-slate-400 opacity-40'}>Open</span>
                        </div>
                    </div>

                    {/* Draggable Thumb Mockup - Large White Bell */}
                    <div 
                        onMouseDown={onStart}
                        onTouchStart={onStart}
                        style={{ transform: `translateX(${swipeX}px)` }}
                        className={`absolute top-1/2 -mt-6.5 w-13 h-13 left-1/2 -ml-6.5 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center z-30 border-4 cursor-grab active:cursor-grabbing will-change-transform
                            ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' : 'transition-none'}
                            ${swipeX > 80 ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/40' : 
                              swipeX < -80 ? 'bg-red-500 border-red-400 shadow-red-500/40' : 
                              'bg-white border-slate-900/10'}
                        `}
                    >
                        <i className={`fi fi-sr-bell text-lg transition-all duration-300 flex items-center justify-center
                           ${(swipeX > 80 || swipeX < -80) ? 'text-white scale-110' : 'text-slate-900'}
                           ${swipeX === 0 && !isDragging ? 'animate-ring' : ''}
                        `}></i>
                    </div>
                  </div>
               </div>
            </div>

            {/* Decorative Element Behind */}
            <div className="absolute top-[20%] left-[-10%] w-[120%] h-[60%] bg-indigo-600/5 rounded-[100px] -rotate-6 -z-10 blur-2xl"></div>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-ring {
          animation: ring 2s infinite ease-in-out;
          transform-origin: top;
        }
      `}</style>
    </section>
  );
}
