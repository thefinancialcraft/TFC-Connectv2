import React from 'react';

interface AppLogoProps {
  size?: 'default' | 'small';
}

export default function AppLogo({ size = 'default' }: AppLogoProps) {
  const isSmall = size === 'small';
  
  return (

    <div className="flex items-center justify-center gap-3">
      {/* Icon */}
      <div 
        className={`inline-flex items-center justify-center rounded-full shrink-0 self-center ${
          isSmall ? 'h-7 w-7' : 'h-[35px] w-[35px] md:h-[30px] md:w-[30px]'
        }`}
        style={{ background: '#4b33e8' }}
      >
        <i 
          className={`fi flex fi-sr-tty-answer ${
            isSmall ? 'text-xs' : 'text-base md:text-sm'
          }`}
          style={{ 
            color: '#FFFFFF'
          }}
        ></i>
      </div>

      {/* Text Group (Name + Tagline) */}
      <div className="flex  flex-col items-start justify-center">
        {/* App Name */}
        <div className="flex  items-baseline leading-none">
          <h1 
            className={`font-[700] leading-none ${
              isSmall ? 'text-xl md:text-xl' : 'text-[26px] md:text-2xl'
            }`}
            style={{ 
              color: '#4b33e8',
              fontFamily: "'Roboto', sans-serif"
            }}
          >
            Rynx
            <span style={{ color: 'rgb(38, 50, 56)' }}>ly</span>
            <span style={{ color: 'rgb(38, 50, 56)', fontSize: '1.5em', lineHeight: '0' }}>.</span>
          </h1>
        </div>
      
        {/* Tagline */}
        {!isSmall && (
          <p 
            className="text-[9px] italic font-medium mt-[1.5px] "
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
    </div>
  );
}

