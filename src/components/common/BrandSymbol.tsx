import React from 'react';

interface BrandSymbolProps {
  size?: number;
  className?: string;
}

export const BrandSymbol: React.FC<BrandSymbolProps> = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brand-grad-emerald" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="brand-grad-glow" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Outer Geometric Frame - Modern Octagonal / Diamond Hex Shield */}
      <path
        d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
        fill="url(#brand-grad-emerald)"
      />

      {/* Inner Recessed Hex Core */}
      <path
        d="M16 6L24.5 11V21L16 26L7.5 21V11L16 6Z"
        fill="#064e3b"
        fillOpacity="0.4"
      />

      {/* Stylized Clinical Cross + Telemetry Pulse Vector (Unique Healthcare-Financial Nexus) */}
      {/* Top and Bottom Anchor Nodes */}
      <path
        d="M16 8V12M16 20V24"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Horizontal Pulse Line with ECG Peak & Financial Step */}
      <path
        d="M8.5 16H12.5L14.2 12.5L16.2 19.5L18.2 14.5L19.8 16H23.5"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4 Corner Precision Telemetry Dots */}
      <circle cx="16" cy="16" r="1.2" fill="#6ee7b7" />
      <circle cx="11.5" cy="11.5" r="1" fill="#a7f3d0" />
      <circle cx="20.5" cy="11.5" r="1" fill="#a7f3d0" />
      <circle cx="11.5" cy="20.5" r="1" fill="#a7f3d0" />
      <circle cx="20.5" cy="20.5" r="1" fill="#a7f3d0" />
    </svg>
  );
};
