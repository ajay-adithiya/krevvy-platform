import React from 'react';

interface LogoProps {
  className?: string;
  showSpotlight?: boolean;
}

export default function Logo({ className = "h-8", showSpotlight = false }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${showSpotlight ? 'p-12 bg-radial from-white via-surface to-surface-container rounded-xl border border-hairline shadow-inner' : ''}`}>
      {showSpotlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-radial from-amber-100/30 to-transparent pointer-events-none blur-xl animate-pulse-slow" />
      )}
      
      <svg 
        viewBox="0 0 240 64" 
        className={`${className} transition-colors duration-300`}
        aria-label="Krevvy Logo"
        role="img"
      >
        <defs>
          <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D27C2C" />
            <stop offset="100%" stopColor="#914D00" />
          </linearGradient>
        </defs>
        
        {/* 'k' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          {/* Vertical Stem */}
          <rect x="20" y="12" width="5.5" height="40" rx="1" />
          {/* Upper diagonal */}
          <path d="M 39 21 L 24.5 35.5 L 28.5 39.5 L 43 25 Z" rx="1" />
        </g>
        {/* Lower diagonal - Copper Accent */}
        <path d="M 23 37 L 38 52 L 44.5 48 L 29.5 33 Z" fill="url(#copperGradient)" />

        {/* 'r' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          <rect x="52" y="24" width="5.5" height="28" rx="1" />
          <path d="M 52 28 C 55 23, 62 23, 66 26.5 L 63.5 31 C 61 29, 56.5 29, 55 33" />
        </g>

        {/* 'e' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          <path d="M 88 38 C 88 30, 72 30, 72 38 C 72 46, 88 46, 88 38 Z M 77.5 35.5 L 82.5 35.5 C 82 33, 78 33, 77.5 35.5 Z" />
          <path d="M 80 24 C 88 24, 88 34, 87 36 L 72.5 36 C 73 42, 85 42, 85 38" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="stroke-pure-black dark:stroke-pure-white" />
        </g>

        {/* 'v' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          <path d="M 94 24.5 L 102.5 48.5 C 103 50, 104 50, 104.5 48.5 L 113 24.5 L 107.5 24.5 L 103.5 41 L 99.5 24.5 Z" />
        </g>

        {/* 'v' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          <path d="M 119 24.5 L 127.5 48.5 C 128 50, 129 50, 129.5 48.5 L 138 24.5 L 132.5 24.5 L 128.5 41 L 124.5 24.5 Z" />
        </g>

        {/* 'y' */}
        <g className="fill-pure-black dark:fill-pure-white transition-colors duration-300">
          {/* Left upper diagonal of y */}
          <path d="M 144 24.5 L 153.5 45 L 148.5 47 L 139 24.5 Z" />
          {/* Right upper to bottom diagonal of y */}
          <path d="M 163 24.5 L 151 51 Z" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" className="stroke-pure-black dark:stroke-pure-white" />
        </g>
        {/* Right tail accent - Copper Accent */}
        <path d="M 152 48.5 L 146.5 61 C 145.5 63, 143.5 63.5, 141.5 62 L 144.5 55.5 Z" fill="url(#copperGradient)" />
      </svg>
    </div>
  );
}
