import { useState, useRef, useEffect } from 'react';

export default function CallEngineShowcase() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // States for interactive Follow-up Slider
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT: MOCKUPS (The "Mockup on Edge" look) --- */}
          <div className={`relative h-[650px] flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-orange-50/50 rounded-full blur-[80px] -z-10" />

            {/* 1. Normal Lead Card (Back Layer) */}
            <div className="absolute top-10 right-0 md:right-4 w-[280px] sm:w-[320px] bg-white rounded-[2.5rem] border border-slate-200 p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-700 z-10 group">
              <div className="flex items-center gap-2 mb-4 px-2">
                 <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[10px]">
                    <i className="fi fi-rr-bolt"></i>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Standard Mode</span>
              </div>

              <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-2">
                <div className="relative z-10 p-2 flex flex-col">
                  <div className="w-full text-center space-y-1 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-white/60 border-indigo-100 text-indigo-600">
                      <div className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest leading-none pt-px">Establishing</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg mt-2 font-extrabold tracking-tight text-slate-800">Ready To Call</h2>
                      <p className="text-[8px] font-medium text-slate-400 leading-tight">Line ready.</p>
                      <div className="flex mt-3 flex-wrap justify-center items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 transition-colors hover:bg-blue-100 hover:border-blue-200 group/phone">
                        <i className="fi flex fi-rr-phone-call text-[10px] text-blue-400 group-hover/phone:text-blue-500 transition-colors"></i>
                        <span className="text-[10px] font-bold font-heading text-blue-700 group-hover/phone:text-blue-800 transition-colors">70******67</span>
                        <span className="px-1.5 ml-1 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border bg-indigo-50 text-indigo-600 border-indigo-200">active</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <div className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                        <div className="w-4 h-4 rounded-lg flex items-center justify-center relative z-10 group-hover:shake">
                          <i className="fi flex fi-rr-phone-call"></i>
                        </div>
                        <span className="relative z-10">Call Now</span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center group">
                        <i className="fi flex fi-brands-whatsapp text-sm group-hover:rotate-12 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Follow-Up Card (Front Layer) */}
            <div className="absolute bottom-10 left-0 md:left-4 w-[280px] sm:w-[320px] bg-white rounded-[2.5rem] border border-orange-100 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-700 z-20 group">
              <div className="flex items-center gap-2 mb-4 px-2">
                 <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[10px]">
                    <i className="fi fi-rr-clock"></i>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Smart Recall</span>
              </div>

              <div className="bg-orange-50/30 rounded-[2rem] border border-orange-100 p-2">
                <div className="relative z-10 p-2 flex flex-col">
                  <div className="w-full text-center space-y-1 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border backdrop-blur-md transition-all duration-500 mx-auto bg-white/60 border-indigo-100 text-indigo-600">
                      <div className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest leading-none pt-px">Establishing</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg mt-2 font-extrabold tracking-tight text-slate-800">Ready To Call</h2>
                      <p className="text-[8px] font-medium text-slate-400 max-w-[160px] leading-tight mt-0.5">Line ready.</p>
                      <div className="flex mt-3 flex-wrap justify-center items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 transition-colors hover:bg-blue-100 hover:border-blue-200 group/phone">
                        <i className="fi flex fi-rr-phone-call text-[10px] text-blue-400 group-hover/phone:text-blue-500 transition-colors"></i>
                        <span className="text-[10px] font-bold font-heading text-blue-700 group-hover/phone:text-blue-800 transition-colors">98******01</span>
                        <span className="px-2 ml-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-orange-50 text-orange-600 border-orange-200 uppercase">followup</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full mt-4">
                    <div className="w-full flex flex-col gap-2 p-2 rounded-2xl bg-orange-50/80 border border-orange-100">
                      <div className="px-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[7px] font-bold text-orange-400 uppercase tracking-wider">Last Interaction</span>
                          <span className="text-[7px] font-medium text-orange-800/60">05/02/2026</span>
                        </div>
                        <p className="text-[9px] font-semibold text-orange-900 border-l-2 border-orange-300 pl-2 line-clamp-1 italic leading-tight text-left">
                          "Busy right now discussion at night"
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full relative h-10">
                        <div 
                           ref={containerRef}
                           onPointerDown={(e) => { setIsDragging(true); startXRef.current = e.clientX; }}
                           onPointerMove={(e) => {
                              if (!isDragging || !containerRef.current) return;
                              let diff = e.clientX - startXRef.current;
                              if (diff > 0 && diff <= containerRef.current.clientWidth - 45) setDragX(diff);
                           }}
                           onPointerUp={() => { setIsDragging(false); setDragX(0); }}
                           className="relative h-full flex-1 rounded-xl bg-orange-100/50 overflow-hidden select-none touch-none border border-orange-200"
                        >
                          <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-40">
                             <i className="fi fi-rr-angle-double-right text-[10px] text-orange-400"></i>
                          </div>
                          <div 
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center gap-2 transition-transform duration-75 ease-out will-change-transform z-10 rounded-xl w-full cursor-grab active:cursor-grabbing`}
                            style={{ transform: `translateX(${dragX}px)` }}
                          >
                            <i className="fi fi-rr-phone-call text-white text-[10px]"></i>
                            <span className="text-white font-black text-[9px] uppercase tracking-widest">Follow Up Call</span>
                          </div>
                        </div>
                        <div className="h-full w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center group shrink-0">
                          <i className="fi fi-brands-whatsapp text-sm group-hover:rotate-12 transition-transform"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT: CONTENT --- */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              Dual Output Engine
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              One Engine. <br />
              <span className="text-[#4b33e8]">Two Intelligence Modes.</span>
            </h2>
            <p className="text-sm text-gray-500 mb-10 leading-relaxed max-w-lg">
              Rynxly's Call Engine dynamically adapts its interface based on the lead's journey. 
              Whether you're hammering through a fresh campaign or managing high-stakes follow-ups, 
              the UI shifts to provide the exact context and protection you need.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <i className="fi fi-rr-bolt text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 font-heading uppercase tracking-wide text-sm">Standard Mode</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                    Designed for speed. Clear calls-to-action and a lightweight interface for rapid lead distribution and closing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <i className="fi fi-rr-clock text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 font-heading uppercase tracking-wide text-sm">Smart Recall Mode</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                    Intelligence-first. Contextual notes and a "Slide-to-Skip" mechanism to ensure you never miss a follow-up or skip a meeting blindly.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
