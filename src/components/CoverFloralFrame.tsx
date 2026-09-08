'use client';

import React from 'react';

interface CoverFloralFrameProps {
  isOpening?: boolean;
}

export const CoverFloralFrame: React.FC<CoverFloralFrameProps> = ({ isOpening = false }) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700 ease-in-out ${
        isOpening ? 'opacity-0 scale-105 -translate-y-8' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* Top-Left Sunflower Corner (Positioned safely at extreme corner) */}
      <div className="absolute -top-10 -left-10 w-44 md:w-64 h-44 md:h-64 drop-shadow-md">
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 C80 20, 160 60, 220 150" stroke="#78350f" strokeWidth="4" opacity="0.5" />
          <path d="M30 10 C80 10, 140 40, 180 100 C130 90, 70 60, 30 10 Z" fill="#15803d" opacity="0.75" />
          <path d="M10 40 C60 30, 120 70, 150 140 C100 130, 50 90, 10 40 Z" fill="#16a34a" opacity="0.8" />

          {/* Main Cover Sunflower */}
          <g transform="translate(75, 75)">
            {Array.from({ length: 16 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-30" rx="8" ry="20" fill="#eab308" transform={`rotate(${i * 22.5})`} />
            ))}
            <circle cx="0" cy="0" r="18" fill="#451a03" />
            <circle cx="0" cy="0" r="14" fill="#78350f" stroke="#eab308" strokeWidth="1" />
          </g>

          {/* Secondary Sunflower */}
          <g transform="translate(150, 45)">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-20" rx="6" ry="14" fill="#facc15" transform={`rotate(${i * 30})`} />
            ))}
            <circle cx="0" cy="0" r="12" fill="#451a03" />
          </g>
        </svg>
      </div>

      {/* Top-Right Sunflower Corner */}
      <div className="absolute -top-10 -right-10 w-44 md:w-64 h-44 md:h-64 drop-shadow-md transform scale-x-[-1]">
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 C80 20, 160 60, 220 150" stroke="#78350f" strokeWidth="4" opacity="0.5" />
          <path d="M30 10 C80 10, 140 40, 180 100 C130 90, 70 60, 30 10 Z" fill="#15803d" opacity="0.75" />
          <g transform="translate(75, 75)">
            {Array.from({ length: 16 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-30" rx="8" ry="20" fill="#eab308" transform={`rotate(${i * 22.5})`} />
            ))}
            <circle cx="0" cy="0" r="18" fill="#451a03" />
          </g>
        </svg>
      </div>

      {/* Bottom-Left Sunflower Corner */}
      <div className="absolute -bottom-10 -left-10 w-40 md:w-56 h-40 md:h-56 drop-shadow-md transform scale-y-[-1]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 10 C60 10, 120 50, 160 120 Z" fill="#15803d" opacity="0.75" />
          <g transform="translate(65, 65)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-22" rx="6" ry="16" fill="#fbbf24" transform={`rotate(${i * 25.7})`} />
            ))}
            <circle cx="0" cy="0" r="14" fill="#78350f" />
          </g>
        </svg>
      </div>

      {/* Bottom-Right Sunflower Corner */}
      <div className="absolute -bottom-10 -right-10 w-40 md:w-56 h-40 md:h-56 drop-shadow-md transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 10 C60 10, 120 50, 160 120 Z" fill="#15803d" opacity="0.75" />
          <g transform="translate(65, 65)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-22" rx="6" ry="16" fill="#fbbf24" transform={`rotate(${i * 25.7})`} />
            ))}
            <circle cx="0" cy="0" r="14" fill="#78350f" />
          </g>
        </svg>
      </div>
    </div>
  );
};
