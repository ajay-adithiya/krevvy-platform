import React from 'react';

interface LogoProps {
  className?: string;
  showSpotlight?: boolean;
  darkMode?: boolean;
}

export default function Logo({
  className = "h-8",
  showSpotlight = false,
  darkMode = false,
}: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${showSpotlight
        ? "p-12 bg-radial from-white via-surface to-surface-container rounded-xl border border-hairline shadow-inner"
        : ""
        }`}
    >
      {showSpotlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-radial from-amber-100/30 to-transparent pointer-events-none blur-xl animate-pulse-slow" />
      )}

      <img
        src={darkMode ? "/logo/krevvy-dark.jpg" : "/logo/krevvy-light.jpg"}
        alt="Krevvy"
        className={`${className} w-auto object-contain`}
        draggable={false}
      />
    </div>
  );
}
