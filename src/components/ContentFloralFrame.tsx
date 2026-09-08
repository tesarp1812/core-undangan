'use client';

import React, { useEffect, useState } from 'react';

export const ContentFloralFrame: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hitung efek animasi scroll in/out dinamis
  // Setiap 600px scroll, buat gelombang opacity & scale in/out yang mulus
  const pulseFactor = Math.sin(scrollY / 250);
  const opacity = 0.65 + pulseFactor * 0.25; // bervariasi antara 0.4 dan 0.9
  const scale = 0.95 + pulseFactor * 0.05; // pulsing scale halus
  const floatOffset = Math.sin(scrollY / 180) * 12; // breathing movement

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden transition-all duration-300 ease-out"
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${floatOffset}px)`,
      }}
    >
      {/* Top Left Distinct Content Botanical Wreath */}
      <div className="absolute -top-6 -left-6 w-48 md:w-64 h-48 md:h-64 drop-shadow-sm">
        <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Long Arching Leaves */}
          <path d="M0 0 C60 15, 140 50, 190 130 C130 110, 60 60, 0 0 Z" fill="#047857" opacity="0.65" />
          <path d="M15 30 C75 25, 135 75, 175 155 C125 135, 65 85, 15 30 Z" fill="#059669" opacity="0.7" />
          <path d="M30 0 C90 15, 150 70, 190 140 C140 115, 80 60, 30 0 Z" fill="#d97706" opacity="0.6" />

          {/* Elegant Rose-Gold Blossom (Distinct from Cover Sunflowers) */}
          <g transform="translate(70, 70)">
            <circle cx="0" cy="0" r="28" fill="#fef3c7" />
            <circle cx="-10" cy="-8" r="18" fill="#fde68a" />
            <circle cx="10" cy="-8" r="18" fill="#fde047" opacity="0.9" />
            <circle cx="0" cy="10" r="18" fill="#f59e0b" opacity="0.9" />
            <circle cx="0" cy="0" r="12" fill="#92400e" />
          </g>

          <circle cx="145" cy="45" r="14" fill="#fbbf24" />
          <circle cx="45" cy="145" r="14" fill="#f59e0b" />
        </svg>
      </div>

      {/* Top Right Distinct Content Botanical Wreath */}
      <div className="absolute -top-6 -right-6 w-48 md:w-64 h-48 md:h-64 drop-shadow-sm transform scale-x-[-1]">
        <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 C60 15, 140 50, 190 130 C130 110, 60 60, 0 0 Z" fill="#047857" opacity="0.65" />
          <path d="M15 30 C75 25, 135 75, 175 155 C125 135, 65 85, 15 30 Z" fill="#059669" opacity="0.7" />
          <g transform="translate(70, 70)">
            <circle cx="0" cy="0" r="28" fill="#fef3c7" />
            <circle cx="-10" cy="-8" r="18" fill="#fde68a" />
            <circle cx="10" cy="-8" r="18" fill="#fde047" opacity="0.9" />
            <circle cx="0" cy="0" r="12" fill="#92400e" />
          </g>
          <circle cx="145" cy="45" r="14" fill="#fbbf24" />
        </svg>
      </div>

      {/* Bottom Left Distinct Botanical Wreath */}
      <div className="absolute -bottom-6 -left-6 w-40 md:w-56 h-40 md:h-56 drop-shadow-sm transform scale-y-[-1]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 C50 15, 120 50, 160 120 Z" fill="#047857" opacity="0.65" />
          <circle cx="60" cy="60" r="22" fill="#fef08a" />
          <circle cx="60" cy="60" r="10" fill="#92400e" />
        </svg>
      </div>

      {/* Bottom Right Distinct Botanical Wreath */}
      <div className="absolute -bottom-6 -right-6 w-40 md:w-56 h-40 md:h-56 drop-shadow-sm transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 C50 15, 120 50, 160 120 Z" fill="#047857" opacity="0.65" />
          <circle cx="60" cy="60" r="22" fill="#fef08a" />
          <circle cx="60" cy="60" r="10" fill="#92400e" />
        </svg>
      </div>
    </div>
  );
};
