import React, { useState, useEffect } from "react";

interface DashboardLoadingStepsProps {
  employeeName?: string;
  isEmployeeSelect?: boolean;
}

export default function DashboardLoadingSteps({
  employeeName,
  isEmployeeSelect = false,
}: DashboardLoadingStepsProps) {
  // Synchronized items: each item pairs an icon and phrase
  const ITEMS = [
    {
      id: 1,
      icon: "fi-rr-shield-check",
      phrase: isEmployeeSelect && employeeName ? `Personalizing view for ${employeeName}` : "Personalizing your dashboard",
    },
    {
      id: 2,
      icon: "fi-rr-phone-call",
      phrase: "Syncing live caller telemetry",
    },
    {
      id: 3,
      icon: "fi-rr-badge-percent",
      phrase: "Evaluating conversion metrics",
    },
    {
      id: 4,
      icon: "fi-rr-clock",
      phrase: "Formulating calling intervals",
    },
    {
      id: 5,
      icon: "fi-rr-chart-histogram",
      phrase: "Finalizing your workspace",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Synchronized phrase loop at 2.4s per step
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ITEMS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [ITEMS.length]);

  const currentItem = ITEMS[currentIndex];

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300">
      {/* Inline styles for smooth continuous animations */}
      <style jsx>{`
        @keyframes snakeRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes snakeDash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
        @keyframes smoothTimeProgress {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes syncFadeSlide {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes syncIconFade {
          0% {
            opacity: 0;
            transform: scale(0.88);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .snake-svg {
          animation: snakeRotate 1.5s linear infinite;
        }
        .snake-circle {
          stroke: #4b33e8;
          stroke-linecap: round;
          animation: snakeDash 1.5s ease-in-out infinite;
        }
        .sync-phrase {
          animation: syncFadeSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sync-icon {
          animation: syncIconFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .segment-fill {
          transform-origin: left;
          animation: smoothTimeProgress 2.4s linear forwards;
        }
      `}</style>

      {/* Clean, Minimal, Uncluttered Container */}
      <div className="w-full max-w-sm bg-transparent flex flex-col items-center text-center">
        {/* Snake Circle with Centered Shuffling Icon */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-4">
          {/* Snake Circle SVG */}
          <svg className="snake-svg w-20 h-20" viewBox="0 0 50 50">
            <circle
              className="snake-circle"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="3"
            />
          </svg>

          {/* Centered Shuffled Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              key={currentIndex}
              className="sync-icon text-[#4b33e8] text-xl leading-none flex items-center justify-center"
            >
              <i className={`fi ${currentItem.icon} flex items-center justify-center`} />
            </span>
          </div>
        </div>

        {/* Dynamic Synchronized Main Text */}
        <div className="h-6 flex items-center justify-center">
          <h4
            key={currentIndex}
            className="sync-phrase text-sm font-bold text-[#263238] tracking-tight truncate max-w-xs"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {currentItem.phrase}
          </h4>
        </div>

        {/* 5-Phase Broken Segments with Smooth Progress (No flickering) */}
        <div className="grid grid-cols-5 gap-1.5 w-64 mt-3.5">
          {ITEMS.map((item, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={item.id}
                className="h-1 bg-gray-200/80 rounded-full overflow-hidden relative"
              >
                {isCompleted && (
                  <div className="h-full w-full bg-[#4b33e8] rounded-full" />
                )}
                {isCurrent && (
                  <div
                    key={currentIndex}
                    className="segment-fill h-full w-full bg-[#4b33e8] rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
