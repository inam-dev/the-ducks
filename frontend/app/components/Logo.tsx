import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeMap[size]} ${className} flex items-center justify-center flex-shrink-0`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="#1e40af" strokeWidth="1.5" />
        
        {/* Main document shape */}
        <path
          d="M 12 8 L 12 32 Q 12 34 14 34 L 28 34 Q 30 34 30 32 L 30 16 L 24 10 Q 22.5 8.5 21 8 L 14 8 Q 12 8 12 10"
          fill="#1e40af"
          stroke="#1e40af"
          strokeWidth="1"
        />
        
        {/* Document fold corner */}
        <path
          d="M 24 8 L 24 14 Q 24 16 26 16 L 30 16"
          fill="#0f172a"
          stroke="none"
        />
        
        {/* Checkmark - certified/verified symbol */}
        <g>
          {/* Checkmark circle background */}
          <circle cx="20" cy="24" r="7" fill="#14b8a6" opacity="0.9" />
          
          {/* Checkmark */}
          <path
            d="M 17.5 24 L 19.5 26 L 23.5 22"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Decorative lines suggesting document content */}
        <line x1="16" y1="14" x2="26" y2="14" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="18" x2="26" y2="18" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="20" y2="22" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
