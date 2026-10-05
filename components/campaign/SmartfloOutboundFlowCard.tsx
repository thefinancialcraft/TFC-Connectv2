import React from 'react';
import { SmartfloCallFlowState, StepColor } from '@/lib/smartfloFlowEngine';

interface SmartfloOutboundFlowCardProps {
  isVisible: boolean;
  flowState: SmartfloCallFlowState;
  onOpenLogsModal?: () => void;
}

export const SmartfloOutboundFlowCard: React.FC<SmartfloOutboundFlowCardProps> = ({
  isVisible,
  flowState,
  onOpenLogsModal,
}) => {
  const { steps } = flowState;

  const getCircleClass = (color: StepColor) => {
    switch (color) {
      case 'orange':
        return 'bg-amber-500 text-white shadow-sm';
      case 'green':
        return 'bg-emerald-500 text-white ring-2 ring-emerald-300 ring-offset-1';
      case 'violet':
        return 'bg-purple-600 text-white ring-2 ring-purple-300 ring-offset-1';
      case 'red':
        return 'bg-red-500 text-white ring-2 ring-red-300 ring-offset-1';
      case 'indigo':
        return 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1';
      default:
        return 'bg-slate-200 text-slate-400';
    }
  };

  const getSublabelClass = (color: StepColor) => {
    switch (color) {
      case 'orange':
        return 'text-amber-600 font-bold';
      case 'green':
        return 'text-emerald-600 font-bold';
      case 'violet':
        return 'text-purple-600 font-bold';
      case 'red':
        return 'text-red-500 font-bold';
      case 'indigo':
        return 'text-indigo-600 font-bold';
      default:
        return 'text-slate-400 font-medium';
    }
  };

  const renderSnakeRing = (color: 'orange' | 'green' | 'indigo') => {
    const stroke = color === 'green' ? '#10b981' : color === 'indigo' ? '#6366f1' : '#f59e0b';
    const track =
      color === 'green'
        ? 'rgba(16, 185, 129, 0.2)'
        : color === 'indigo'
        ? 'rgba(99, 102, 241, 0.2)'
        : 'rgba(245, 158, 11, 0.25)';

    return (
      <svg
        className="snake-ring-spinner absolute -inset-1 w-9 h-9 pointer-events-none z-0"
        viewBox="0 0 36 36"
        style={{ animation: 'snakeRingSpin 1.1s linear infinite' }}
      >
        <circle cx="18" cy="18" r="16" fill="none" stroke={track} strokeWidth="1.5" />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeDasharray="28 72"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform ${
        isVisible
          ? 'max-h-48 opacity-100 translate-y-0 pointer-events-auto'
          : 'max-h-0 opacity-0 -translate-y-3 pointer-events-none -mb-4 overflow-hidden'
      }`}
    >
      {/* Visual Outbound Tag */}
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
          <i className="fi flex fi-rr-phone-call text-indigo-500 text-[10px]"></i>
          Outbound Calling Flow
        </span>
        <div className="flex items-center gap-1.5">
          {flowState.duration > 0 && (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {flowState.duration}s
            </span>
          )}
          {onOpenLogsModal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLogsModal();
              }}
              title="Open Live Call API Logs & Diagnostics"
              className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-200 transition-all flex items-center gap-1 text-[10px] font-semibold shadow-xs"
            >
              <i className="fi flex fi-rr-arrow-up-right-from-square text-[9px]"></i>
              <span className="text-[9px]">Live Logs</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative pt-1 pb-0.5">
        {/* Connecting track line between circles */}
        <div className="absolute top-[17px] left-[12%] mt-3 right-[12%] h-[2px] bg-slate-200 -z-0" />

        <div className="grid grid-cols-4 gap-1 mt-3 relative z-10 text-center">
          {/* Step 1: Originated (Ref Issued) */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mb-1 ring-2 ring-emerald-300 ring-offset-1 shadow-none">
              <i className="fi flex fi-rr-check text-[10px]"></i>
            </div>
            <span className="text-[9px] font-bold text-slate-800">Originated</span>
            <span className="text-[8px] text-emerald-600 font-semibold">Ref Issued</span>
          </div>

          {/* Step 2: Agent Leg */}
          <div className="flex flex-col items-center">
            <div className="relative w-7 h-7 flex items-center justify-center mb-1">
              {steps.step2.isSpinning && steps.step2.spinColor && renderSnakeRing(steps.step2.spinColor)}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10 ${getCircleClass(
                  steps.step2.color
                )}`}
              >
                <i className="fi flex fi-rr-phone-call text-[10px]"></i>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-800">Agent Leg</span>
            <span
              className={`text-[8px] truncate max-w-[70px] ${getSublabelClass(steps.step2.color)}`}
              title={steps.step2.sublabel}
            >
              {steps.step2.sublabel}
            </span>
          </div>

          {/* Step 3: Customer */}
          <div className="flex flex-col items-center">
            <div className="relative w-7 h-7 flex items-center justify-center mb-1">
              {steps.step3.isSpinning && steps.step3.spinColor && renderSnakeRing(steps.step3.spinColor)}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10 ${getCircleClass(
                  steps.step3.color
                )}`}
              >
                <i className="fi flex fi-rr-user text-[10px]"></i>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-800">Customer</span>
            <span
              className={`text-[8px] truncate max-w-[70px] ${getSublabelClass(steps.step3.color)}`}
              title={steps.step3.sublabel}
            >
              {steps.step3.sublabel}
            </span>
          </div>

          {/* Step 4: Hangup */}
          <div className="flex flex-col items-center">
            <div className="relative w-7 h-7 flex items-center justify-center mb-1">
              {steps.step4.isSpinning && steps.step4.spinColor && renderSnakeRing(steps.step4.spinColor)}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10 ${getCircleClass(
                  steps.step4.color
                )}`}
              >
                <i className="fi flex fi-rr-phone-slash text-[10px]"></i>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-800">Hangup</span>
            <span
              className={`text-[8px] truncate max-w-[70px] ${getSublabelClass(steps.step4.color)}`}
              title={steps.step4.sublabel}
            >
              {steps.step4.sublabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartfloOutboundFlowCard;
