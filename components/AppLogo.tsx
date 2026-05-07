import React, { useState, useEffect } from 'react';

interface AppLogoProps {
  size?: 'default' | 'small';
}

export default function AppLogo({ size = 'default' }: AppLogoProps) {
  const isSmall = size === 'small';
  const [isRingsly, setIsRingsly] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRingsly(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-start justify-center group select-none">
      {/* Top Row: Icon + App Name */}
      <div className="flex items-center justify-start gap-2 h-10 md:h-12">
        {/* Icon Container */}
        <div className="inline-flex items-center justify-center shrink-0">
          <i 
            className={`fi flex fi-sr-tty-answer transition-all duration-700 ${
              isRingsly ? 'rotate-[360deg]' : 'rotate-0'
            } ${
              isSmall ? 'text-base' : 'text-lg' 
            }`}
            style={{ 
              color: '#4b33e8',
              lineHeight: 1
            }}
          ></i>
        </div>

        {/* App Name with Full Transition */}
        <div className={`relative overflow-hidden ${isSmall ? 'h-7' : 'h-8'}`}>
          <div 
            className={`flex flex-col transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${
              isRingsly ? '-translate-y-1/2' : 'translate-y-0'
            }`}
          >
            {/* Word 1: Rynxly */}
            <h1 
              className={`font-[600] whitespace-nowrap flex items-center transition-opacity duration-700 leading-none ${
                isRingsly ? 'opacity-0' : 'opacity-100'
              } ${
                isSmall ? 'text-xl' : 'text-2xl'
              }`}
              style={{ 
                color: '#4b33e8',
                fontFamily: "'Inter', 'Roboto', sans-serif",
                height: isSmall ? '1.75rem' : '2rem'
              }}
            >
              Rynx<span style={{ color: '#263238' }}>ly</span>
              <span style={{ color: '#263238' }}>.</span>
            </h1>

            {/* Word 2: Ringsly */}
            <h1 
              className={`font-[600] whitespace-nowrap flex items-center transition-opacity duration-700 leading-none ${
                isRingsly ? 'opacity-100' : 'opacity-0'
              } ${
                isSmall ? 'text-xl' : 'text-2xl'
              }`}
              style={{ 
                color: '#4b33e8',
                fontFamily: "'Inter', 'Roboto', sans-serif",
                height: isSmall ? '1.75rem' : '2rem'
              }}
            >
              Rings<span style={{ color: '#263238' }}>ly</span>
              <span style={{ color: '#263238' }}>.</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Bottom Row: Tagline */}
      {!isSmall && (
        <p 
          className="text-[10px] font-medium tracking-wide italic mt-[-10px] ml-1 opacity-70"
          style={{ 
            color: '#787E9D',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '0.05em'
          }}
        >
          track • call • close
        </p>
      )}
    </div>
  );
}

