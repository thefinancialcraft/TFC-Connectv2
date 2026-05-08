
import React from 'react';

export default function ExpiryBadge({ expireDate, onClick }: { expireDate: string | null; onClick?: () => void }) {
  if (!expireDate) return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 ${onClick ? 'cursor-pointer hover:bg-slate-200 transition-colors' : ''}`}
    >
      <i className="fi flex fi-rr-calendar text-[10px]"></i>
      <span>Set Expiry</span>
    </span>
  );
  
  const now = new Date();
  const expire = new Date(expireDate);
  const diffTime = expire.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let colorClass = 'bg-emerald-100 text-emerald-600';
  let iconClass = 'fi-rr-calendar-clock';
  let text = `${diffDays} Days Left`;

  if (diffDays < 0) {
     colorClass = 'bg-red-100 text-red-600';
     iconClass = 'fi-rr-cross-circle';
     text = 'Expired';
  } else if (diffDays <= 7) {
     colorClass = 'bg-orange-100 text-orange-600';
     iconClass = 'fi-rr-clock';
  }

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass} ${onClick ? 'cursor-pointer hover:opacity-80 transition-all active:scale-95' : ''}`}
    >
      <i className={`fi flex ${iconClass} text-[10px]`}></i>
      <span>{text}</span>
    </span>
  );
}

