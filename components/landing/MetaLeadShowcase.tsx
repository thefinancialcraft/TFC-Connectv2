import React, { useState, useEffect } from 'react';

interface FlowRoute {
  id: number;
  platform: 'Facebook' | 'Instagram' | 'Meta';
  adTitle: string;
  leadName: string;
  leadPhone: string;
  agentName: string;
  agentSim: string;
  adY: number;
  agentY: number;
  inPath: string;
  outPath: string;
}

const ROUTES: FlowRoute[] = [
  {
    id: 0,
    platform: 'Facebook',
    adTitle: 'Facebook Lead Ad #1',
    leadName: 'Rohan Mehta',
    leadPhone: '+91 98765 •••12',
    agentName: 'Priya S.',
    agentSim: 'SIM 1 • Auto Call',
    adY: 56,
    agentY: 56,
    inPath: 'M 155 56 C 215 56, 215 150, 275 150',
    outPath: 'M 365 150 C 425 150, 425 56, 485 56',
  },
  {
    id: 1,
    platform: 'Instagram',
    adTitle: 'Instagram Story Ad #2',
    leadName: 'Ananya Verma',
    leadPhone: '+91 91234 •••89',
    agentName: 'Amit P.',
    agentSim: 'SIM 2 • Instant Dial',
    adY: 150,
    agentY: 150,
    inPath: 'M 155 150 L 275 150',
    outPath: 'M 365 150 L 485 150',
  },
  {
    id: 2,
    platform: 'Meta',
    adTitle: 'Meta Campaign Ad #3',
    leadName: 'Vikram Roy',
    leadPhone: '+91 88990 •••44',
    agentName: 'Karan M.',
    agentSim: 'SIM 1 • Priority',
    adY: 244,
    agentY: 244,
    inPath: 'M 155 244 C 215 244, 215 150, 275 150',
    outPath: 'M 365 150 C 425 150, 425 244, 485 244',
  },
];

function BrandIcon({ platform, className = 'w-5 h-5' }: { platform: 'Facebook' | 'Instagram' | 'Meta'; className?: string }) {
  if (platform === 'Facebook') {
    return (
      <svg className={`${className} text-[#1877F2] shrink-0`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (platform === 'Instagram') {
    return (
      <svg className={`${className} text-[#E4405F] shrink-0`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return (
    <svg className={`${className} text-[#0081FB] shrink-0`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 6.5c-2.1 0-3.7 1.3-5.2 3.7C10.9 7.8 9.3 6.5 7.2 6.5 4.1 6.5 2 9.1 2 12.6c0 3.2 2.1 4.9 4.4 4.9 2 0 3.7-1.3 5.6-4.4 1.6 2.7 3.1 4.4 5.3 4.4 2.5 0 4.7-2 4.7-5.1 0-3.4-2.1-5.9-4.5-5.9zm-11 8.8c-1.3 0-2.3-1-2.3-2.7 0-2.2 1.2-3.9 2.9-3.9 1.3 0 2.4 1 3.7 3.1-1.5 2.4-2.8 3.5-4.3 3.5zm10.8 0c-1.3 0-2.5-1.2-3.8-3.4 1.2-2 2.4-3.2 3.9-3.2 1.6 0 2.6 1.5 2.6 3.7 0 1.9-1.1 2.9-2.7 2.9z" />
    </svg>
  );
}

export default function MetaLeadShowcase() {
  const [activeRoute, setActiveRoute] = useState<number>(0);
  // step 0: Ad -> Engine, step 1: Engine Processing, step 2: Engine -> Agent
  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return 2;
        setActiveRoute((r) => (r + 1) % ROUTES.length);
        return 0;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const active = ROUTES[activeRoute];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Minimal Copy + Live Route Selector */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              <BrandIcon platform="Meta" className="w-6 h-6" />
              <BrandIcon platform="Facebook" className="w-5 h-5" />
              <BrandIcon platform="Instagram" className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] leading-snug">
              Direct Meta Lead Routing to Your Sales Agents
            </h2>
            <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
              Connect multiple Facebook &amp; Instagram ad campaigns to the Rynxly Engine. Every incoming lead is automatically routed to the assigned agent&apos;s SIM dialer within seconds.
            </p>

            {/* Interactive Minimal List */}
            <div className="mt-6 space-y-2">
              {ROUTES.map((route, idx) => {
                const isSelected = activeRoute === idx;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => {
                      setActiveRoute(idx);
                      setStep(0);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#4b33e8] bg-[#f8f7ff]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandIcon platform={route.platform} className="w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-900 truncate">
                        {route.adTitle}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono shrink-0">
                      → {route.agentName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Node-Graph Canvas */}
          <div className="lg:col-span-7">
            <div className="relative w-full bg-[#fafafa] rounded-2xl border border-gray-200 p-4 sm:p-6 overflow-hidden">
              
              {/* Subtle Dot Grid Background */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              />

              {/* SVG Node Diagram */}
              <div className="relative z-10 w-full">
                <svg
                  viewBox="0 0 640 300"
                  className="w-full h-auto overflow-visible select-none"
                >
                  {/* Base & Animated Curved Wires */}
                  {ROUTES.map((route, idx) => {
                    const isCurrent = activeRoute === idx;
                    return (
                      <g key={route.id}>
                        {/* 1. Base Track Wires */}
                        <path
                          d={route.inPath}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d={route.outPath}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* 2. Continuous Subtle Flowing Dashes on Inactive Wires */}
                        {!isCurrent && (
                          <>
                            <path
                              d={route.inPath}
                              fill="none"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              strokeDasharray="4 8"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="24"
                                to="0"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path
                              d={route.outPath}
                              fill="none"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              strokeDasharray="4 8"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="24"
                                to="0"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </>
                        )}

                        {/* 3. Active Route Animated Flowing Path (Ad -> Engine) */}
                        {isCurrent && (
                          <>
                            {/* Drawn solid line */}
                            <path
                              d={route.inPath}
                              fill="none"
                              stroke="#4b33e8"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              pathLength="100"
                              strokeDasharray="100"
                              strokeDashoffset="0"
                            >
                              {step === 0 && (
                                <animate
                                  attributeName="stroke-dashoffset"
                                  from="100"
                                  to="0"
                                  dur="0.6s"
                                  fill="freeze"
                                />
                              )}
                            </path>

                            {/* Fast flowing dashes overlay */}
                            <path
                              d={route.inPath}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              strokeDasharray="4 10"
                              opacity="0.85"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="28"
                                to="0"
                                dur="0.6s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </>
                        )}

                        {/* 4. Active Route Animated Flowing Path (Engine -> Agent) */}
                        {isCurrent && step === 2 && (
                          <>
                            <path
                              d={route.outPath}
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              pathLength="100"
                              strokeDasharray="100"
                              strokeDashoffset="0"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="100"
                                to="0"
                                dur="0.55s"
                                fill="freeze"
                              />
                            </path>

                            {/* Fast flowing dashes overlay */}
                            <path
                              d={route.outPath}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              strokeDasharray="4 10"
                              opacity="0.85"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="28"
                                to="0"
                                dur="0.6s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </>
                        )}

                        {/* 5. Traveling Lead Packet Dot: Ad -> Engine */}
                        {isCurrent && step === 0 && (
                          <g>
                            <circle r="7" fill="#4b33e8" opacity="0.2">
                              <animateMotion
                                dur="0.85s"
                                repeatCount="1"
                                fill="freeze"
                                path={route.inPath}
                              />
                            </circle>
                            <circle r="4.5" fill="#4b33e8">
                              <animateMotion
                                dur="0.85s"
                                repeatCount="1"
                                fill="freeze"
                                path={route.inPath}
                              />
                            </circle>
                          </g>
                        )}

                        {/* 6. Traveling Lead Packet Dot: Engine -> Agent */}
                        {isCurrent && step === 2 && (
                          <g>
                            <circle r="7" fill="#10b981" opacity="0.25">
                              <animateMotion
                                dur="0.8s"
                                repeatCount="1"
                                fill="freeze"
                                path={route.outPath}
                              />
                            </circle>
                            <circle r="4.5" fill="#10b981">
                              <animateMotion
                                dur="0.8s"
                                repeatCount="1"
                                fill="freeze"
                                path={route.outPath}
                              />
                            </circle>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* LEFT NODES: 3 Meta Ad Nodes */}
                  {ROUTES.map((route, idx) => {
                    const isCurrent = activeRoute === idx;
                    return (
                      <g
                        key={`ad-${route.id}`}
                        transform={`translate(10, ${route.adY - 28})`}
                        onClick={() => {
                          setActiveRoute(idx);
                          setStep(0);
                        }}
                        className="cursor-pointer"
                      >
                        <rect
                          width="145"
                          height="56"
                          rx="12"
                          fill="#ffffff"
                          stroke={isCurrent ? '#4b33e8' : '#e2e8f0'}
                          strokeWidth={isCurrent ? '2' : '1.2'}
                        />
                        <foreignObject x="10" y="9" width="125" height="40">
                          <div className="flex items-center gap-2 h-full">
                            <BrandIcon platform={route.platform} className="w-5 h-5" />
                            <div className="min-w-0 leading-tight">
                              <p className="text-[11px] font-bold text-gray-900 truncate">
                                {route.platform} Ad
                              </p>
                              <p className="text-[10px] text-gray-500 truncate">
                                {route.leadName}
                              </p>
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}

                  {/* CENTER NODE: Rynxly Engine Hub */}
                  <g transform="translate(275, 102)">
                    <rect
                      width="90"
                      height="96"
                      rx="18"
                      fill="#ffffff"
                      stroke={step === 1 ? '#4b33e8' : '#cbd5e1'}
                      strokeWidth={step === 1 ? '2.5' : '1.5'}
                    />
                    <foreignObject x="6" y="10" width="78" height="76">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            step === 1
                              ? 'bg-[#4b33e8] text-white'
                              : 'bg-[#f6f5ff] text-[#4b33e8]'
                          }`}
                        >
                          <i className="fi flex fi-sr-tty-answer text-base leading-none"></i>
                        </div>
                        <p className="text-[11px] font-bold mt-1.5 leading-none">
                          <span className="text-[#4b33e8]">Rynx</span>
                          <span className="text-[#263238]">ly.</span>
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-none">
                          {step === 1 ? 'Routing...' : 'Engine'}
                        </p>
                      </div>
                    </foreignObject>
                  </g>

                  {/* RIGHT NODES: 3 Sales Agent Nodes */}
                  {ROUTES.map((route, idx) => {
                    const isReceiving = activeRoute === idx && step === 2;
                    return (
                      <g
                        key={`agent-${route.id}`}
                        transform={`translate(485, ${route.agentY - 28})`}
                      >
                        <rect
                          width="145"
                          height="56"
                          rx="12"
                          fill="#ffffff"
                          stroke={isReceiving ? '#10b981' : '#e2e8f0'}
                          strokeWidth={isReceiving ? '2' : '1.2'}
                        />
                        <foreignObject x="10" y="9" width="125" height="40">
                          <div className="flex items-center gap-2 h-full">
                            <div
                              className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isReceiving
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {route.agentName.charAt(0)}
                            </div>
                            <div className="min-w-0 leading-tight">
                              <p className="text-[11px] font-bold text-gray-900 truncate">
                                {route.agentName}
                              </p>
                              <p
                                className={`text-[10px] truncate ${
                                  isReceiving
                                    ? 'text-emerald-600 font-semibold'
                                    : 'text-gray-500'
                                }`}
                              >
                                {isReceiving ? `Dialing ${route.leadName}` : route.agentSim}
                              </p>
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>

                {/* Minimal Status Footer inside Canvas */}
                <div className="mt-2 pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4b33e8]" />
                    <span>
                      <strong>{active.leadName}</strong> ({active.leadPhone})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-500">
                    {step === 0 && `${active.platform} Ad → Rynxly Engine`}
                    {step === 1 && 'Rynxly Engine Matching Agent...'}
                    {step === 2 && `Assigned to ${active.agentName} (SIM Dialer)`}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
