import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const GaralaLogo: React.FC<LogoProps> = ({ className = "h-10", showText = true }) => {
  return (
    <svg viewBox={showText ? "0 0 330 80" : "0 0 80 80"} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon Group */}
      <g transform="translate(4, 4)">
        {/* Blue Pin Part (Bottom) */}
        <path 
          d="M36 40C36 40 36 60 48 70C60 60 60 40 60 40H36Z" 
          fill="#0092D0" 
          stroke="#0F172A" 
          strokeWidth="5" 
          strokeLinejoin="round" 
        />
        
        {/* Orange Megaphone Part (Top) */}
        {/* Main Body */}
        <path 
          d="M20 30C16 30 14 32 14 38C14 44 16 46 20 46H42V30H20Z" 
          fill="#F97316" 
          stroke="#0F172A" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />
        {/* Bell */}
        <path 
          d="M42 30H46L66 12V64L46 46H42V30Z" 
          fill="#F97316" 
          stroke="#0F172A" 
          strokeWidth="5" 
          strokeLinejoin="round" 
        />
        
        {/* Center Hole / Detail */}
        <circle cx="48" cy="40" r="7" fill="white" stroke="#0F172A" strokeWidth="5" />
      </g>
      
      {/* Text Part */}
      {showText && (
        <text 
          x="90" 
          y="58" 
          fontFamily="'Inter', sans-serif" 
          fontWeight="900" 
          fontSize="52" 
          fill="currentColor"
          letterSpacing="-0.02em"
        >
          GARALA
        </text>
      )}
    </svg>
  );
};