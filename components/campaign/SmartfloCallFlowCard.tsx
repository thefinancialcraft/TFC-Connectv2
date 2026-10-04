import React from 'react';
import { SmartfloCallFlowState, FlowStepState, StepColor } from '@/lib/smartfloFlowEngine';

interface SmartfloCallFlowCardProps {
  isVisible: boolean;
  flowState: SmartfloCallFlowState;
}

export const SmartfloCallFlowCard: React.FC<SmartfloCallFlowCardProps> = ({
  isVisible,
  flowState,
}) => {
  const { steps, direction } = flowState;
  const isInbound = direction === 'inbound';

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

  const renderStep = (step: FlowStepState) => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-7 h-7 flex items-center justify-center mb-1">
          {step.isSpinning && step.spinColor && renderSnakeRing(step.spinColor)}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10 ${getCircleClass(
              step.color
            )}`}
          >
            <i className={`fi flex ${step.icon} text-[10px]`}></i>
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-800">{step.title}</span>
        <span
          className={`text-[8px] truncate max-w-[70px] ${getSublabelClass(step.color)}`}
          title={step.sublabel}
        >
          {step.sublabel}
        </span>
      </div>
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
      <div className="relative pt-1 pb-0.5">
        {/* Connecting track line between circles */}
        <div className="absolute top-[17px] left-[12%] mt-3 right-[12%] h-[2px] bg-slate-200 -z-0" />

        <div className="grid grid-cols-4 gap-1 mt-3 relative z-10 text-center">
          {renderStep(steps.step1)}
          {renderStep(steps.step2)}
          {renderStep(steps.step3)}
          {renderStep(steps.step4)}
        </div>
      </div>
    </div>
  );
};

export default SmartfloCallFlowCard;
