import React from 'react';

interface AppLogoProps {
  size?: 'default' | 'small';
}

export default function AppLogo({ size = 'default' }: AppLogoProps) {
  const isSmall = size === 'small';
  
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Icon */}
      <div 
        className={`inline-flex items-center justify-center rounded-full shadow-lg ${
          isSmall ? 'h-7 w-7' : 'h-[35px] w-[35px] md:h-[30px] md:w-[30px]'
        }`}
        style={{ background: '#4b33e8' }}
      >
        <i 
          className={`fi flex fi-rr-link ${
            isSmall ? 'text-xs' : 'text-base md:text-sm'
          }`}
          style={{ 
            color: '#FFFFFF'
          }}
        ></i>
      </div>

      {/* Text: tfc Connect */}
      <div className="flex items-baseline gap-[2px]">
        <h1 
          className={`font-[900] ${
            isSmall ? 'text-2xl md:text-2xl' : 'text-3xl md:text-2xl'
          }`}
          style={{ 
            color: 'rgb(38, 50, 56)',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          tfc
        </h1>

        <h3
          className={`font-[300] ${
            isSmall ? 'text-2xl md:text-2xl' : 'text-3xl md:text-2xl'
          }`}
          style={{ 
            color: '#4b33e8',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          Connect
        </h3>
      </div>
    </div>
  );
}

