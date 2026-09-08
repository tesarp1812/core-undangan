'use client';

import React, { useEffect, useState } from 'react';

export const FloralLayer: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jika scroll > 500px, sembunyikan untuk menghemat resource GPU
  if (scrollY > 500) return null;

  // Hitung pergeseran & opacity (0px - 350px scroll)
  const progress = Math.min(scrollY / 350, 1);
  const opacity = Math.max(1 - progress * 1.2, 0);
  const offset = progress * 120; // slide outward

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300 overflow-hidden"
      style={{ opacity }}
    >
      {/* Top Left Wreath Ornament */}
      <div
        className="absolute -top-4 -left-4 w-48 md:w-72 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${-offset}px, ${-offset}px)` }}
      >
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Leaves */}
          <path d="M20 40 C60 20, 120 60, 90 140 C50 170, 10 100, 20 40 Z" fill="#78350f" opacity="0.15" />
          <path d="M50 10 C100 30, 140 100, 110 160 C40 140, 20 60, 50 10 Z" fill="#92400e" opacity="0.2" />
          {/* Main Gold Floral Blossoms */}
          <circle cx="80" cy="75" r="38" fill="#fef3c7" />
          <circle cx="110" cy="60" r="30" fill="#fde68a" />
          <circle cx="55" cy="95" r="28" fill="#fef08a" />
          <circle cx="95" cy="100" r="32" fill="#fde047" opacity="0.9" />
          <circle cx="82" cy="78" r="18" fill="#b45309" />
          {/* Accent Petals */}
          <circle cx="160" cy="50" r="20" fill="#fbbf24" />
          <circle cx="45" cy="160" r="22" fill="#f59e0b" />
          <circle cx="140" cy="120" r="16" fill="#d97706" opacity="0.8" />
        </svg>
      </div>

      {/* Top Right Wreath Ornament */}
      <div
        className="absolute -top-4 -right-4 w-48 md:w-72 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${offset}px, ${-offset}px)` }}
      >
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Leaves */}
          <path d="M230 40 C190 20, 130 60, 160 140 C200 170, 240 100, 230 40 Z" fill="#78350f" opacity="0.15" />
          <path d="M200 10 C150 30, 110 100, 140 160 C210 140, 230 60, 200 10 Z" fill="#92400e" opacity="0.2" />
          {/* Main Gold Floral Blossoms */}
          <circle cx="170" cy="75" r="38" fill="#fef3c7" />
          <circle cx="140" cy="60" r="30" fill="#fde68a" />
          <circle cx="195" cy="95" r="28" fill="#fef08a" />
          <circle cx="155" cy="100" r="32" fill="#fde047" opacity="0.9" />
          <circle cx="168" cy="78" r="18" fill="#b45309" />
          {/* Accent Petals */}
          <circle cx="90" cy="50" r="20" fill="#fbbf24" />
          <circle cx="205" cy="160" r="22" fill="#f59e0b" />
          <circle cx="110" cy="120" r="16" fill="#d97706" opacity="0.8" />
        </svg>
      </div>

      {/* Bottom Left Wreath Ornament */}
      <div
        className="absolute -bottom-4 -left-4 w-44 md:w-64 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${-offset}px, ${offset}px)` }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <circle cx="70" cy="145" r="36" fill="#fef3c7" />
          <circle cx="100" cy="130" r="26" fill="#fde68a" />
          <circle cx="50" cy="115" r="24" fill="#fef08a" />
          <circle cx="72" cy="144" r="16" fill="#b45309" />
          <path d="M20 180 C60 170, 110 120, 60 90 Z" fill="#78350f" opacity="0.2" />
        </svg>
      </div>

      {/* Bottom Right Wreath Ornament */}
      <div
        className="absolute -bottom-4 -right-4 w-44 md:w-64 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${offset}px, ${offset}px)` }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <circle cx="130" cy="145" r="36" fill="#fef3c7" />
          <circle cx="100" cy="130" r="26" fill="#fde68a" />
          <circle cx="150" cy="115" r="24" fill="#fef08a" />
          <circle cx="128" cy="144" r="16" fill="#b45309" />
          <path d="M180 180 C140 170, 90 120, 140 90 Z" fill="#78350f" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
};
