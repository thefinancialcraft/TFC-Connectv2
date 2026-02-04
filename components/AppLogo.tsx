import React from 'react';

interface AppLogoProps {
  size?: 'default' | 'small';
}

export default function AppLogo({ size = 'default' }: AppLogoProps) {
  const isSmall = size === 'small';
  
  return (
    <div className="flex flex-col items-start justify-center">
      {/* Top Row: Icon + App Name */}
      <div className="flex items-center justify-start gap-2">
        {/* Icon */}
        <div 
          className={`inline-flex items-center justify-center rounded-full shrink-0 ${
            isSmall ? 'h-5 w-5' : 'h-[24px] w-[24px] md:h-[22px] md:w-[22px]'
          }`}
          style={{ background: 'transparent' }} 
        >
          <i 
            className={`fi flex mt-2 ml-2 fi-sr-tty-answer ${
              isSmall ? 'text-base' : 'text-xl md:text-lg' 
            }`}
            style={{ 
              color: '#4b33e8', // Purple Icon
              lineHeight: 1
            }}
          ></i>
        </div>

        {/* App Name */}
        <h1 
          className={`font-[700] leading-none mt-1.5 ${
            isSmall ? 'text-xl md:text-xl' : 'text-[26px] md:text-2xl'
          }`}
          style={{ 
            color: '#4b33e8',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          Rynx
          <span style={{ color: '#263238ff' }}>ly</span>
          <span style={{ color: 'rgb(38, 50, 56)', fontSize: '1.5em', lineHeight: '0' }}>.</span>
        </h1>
      </div>
      
      {/* Bottom Row: Tagline */}
      {!isSmall && (
        <p 
          className="text-[10px] font-medium tracking-wide italic mt-[2px] ml-1"
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

