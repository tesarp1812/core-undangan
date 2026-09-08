'use client';

import React from 'react';

export const LushFloralFrame: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* TOP-LEFT LUSH SUNFLOWER & LONG VINES CLUSTER */}
      <div className="absolute -top-6 -left-6 w-56 md:w-80 h-56 md:h-80 drop-shadow-lg">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Tree Branches & Long Vine Leaves */}
          <path d="M0 0 C100 20, 200 80, 280 180" stroke="#78350f" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <path d="M0 40 C120 40, 180 140, 240 250" stroke="#92400e" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

          {/* Long Botanical Leaves */}
          <path d="M40 20 C100 10, 160 50, 210 120 C150 110, 80 70, 40 20 Z" fill="#15803d" opacity="0.75" />
          <path d="M20 60 C80 50, 140 100, 180 180 C120 160, 60 120, 20 60 Z" fill="#16a34a" opacity="0.8" />
          <path d="M60 0 C120 20, 180 80, 220 150 C160 120, 100 50, 60 0 Z" fill="#ca8a04" opacity="0.7" />

          {/* Sunflower 1 (Main Big Sunflower) */}
          <g transform="translate(90, 90)">
            {/* Petals */}
            {Array.from({ length: 16 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-36"
                rx="9"
                ry="24"
                fill="#eab308"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
            {/* Center Core */}
            <circle cx="0" cy="0" r="22" fill="#451a03" />
            <circle cx="0" cy="0" r="18" fill="#78350f" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>

          {/* Sunflower 2 (Secondary Sunflower) */}
          <g transform="translate(180, 60)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-26"
                rx="7"
                ry="18"
                fill="#facc15"
                transform={`rotate(${i * 25.7})`}
              />
            ))}
            <circle cx="0" cy="0" r="16" fill="#451a03" />
          </g>

          {/* Sunflower 3 (Bottom Corner Sunflower) */}
          <g transform="translate(50, 170)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-24"
                rx="6.5"
                ry="16"
                fill="#fbbf24"
                transform={`rotate(${i * 25.7})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" fill="#78350f" />
          </g>

          {/* Small Wildflowers & Buds */}
          <circle cx="230" cy="120" r="10" fill="#fef08a" />
          <circle cx="120" cy="210" r="12" fill="#fde047" />
          <circle cx="210" cy="200" r="8" fill="#f59e0b" />
        </svg>
      </div>

      {/* TOP-RIGHT LUSH SUNFLOWER & LONG VINES CLUSTER */}
      <div className="absolute -top-6 -right-6 w-56 md:w-80 h-56 md:h-80 drop-shadow-lg transform scale-x-[-1]">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Tree Branches & Long Vine Leaves */}
          <path d="M0 0 C100 20, 200 80, 280 180" stroke="#78350f" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <path d="M0 40 C120 40, 180 140, 240 250" stroke="#92400e" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

          {/* Long Botanical Leaves */}
          <path d="M40 20 C100 10, 160 50, 210 120 C150 110, 80 70, 40 20 Z" fill="#15803d" opacity="0.75" />
          <path d="M20 60 C80 50, 140 100, 180 180 C120 160, 60 120, 20 60 Z" fill="#16a34a" opacity="0.8" />
          <path d="M60 0 C120 20, 180 80, 220 150 C160 120, 100 50, 60 0 Z" fill="#ca8a04" opacity="0.7" />

          {/* Sunflower 1 (Main Big Sunflower) */}
          <g transform="translate(90, 90)">
            {Array.from({ length: 16 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-36"
                rx="9"
                ry="24"
                fill="#eab308"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
            <circle cx="0" cy="0" r="22" fill="#451a03" />
            <circle cx="0" cy="0" r="18" fill="#78350f" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>

          {/* Sunflower 2 */}
          <g transform="translate(180, 60)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-26"
                rx="7"
                ry="18"
                fill="#facc15"
                transform={`rotate(${i * 25.7})`}
              />
            ))}
            <circle cx="0" cy="0" r="16" fill="#451a03" />
          </g>

          {/* Sunflower 3 */}
          <g transform="translate(50, 170)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-24"
                rx="6.5"
                ry="16"
                fill="#fbbf24"
                transform={`rotate(${i * 25.7})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" fill="#78350f" />
          </g>

          {/* Small Wildflowers & Buds */}
          <circle cx="230" cy="120" r="10" fill="#fef08a" />
          <circle cx="120" cy="210" r="12" fill="#fde047" />
          <circle cx="210" cy="200" r="8" fill="#f59e0b" />
        </svg>
      </div>

      {/* BOTTOM-LEFT LUSH BOTANICAL CORNER */}
      <div className="absolute -bottom-6 -left-6 w-48 md:w-72 h-48 md:h-72 drop-shadow-lg transform scale-y-[-1]">
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 20 C80 20, 150 80, 200 160" stroke="#78350f" strokeWidth="4" opacity="0.6" />
          <path d="M20 40 C80 30, 140 80, 170 140 Z" fill="#15803d" opacity="0.75" />
          <g transform="translate(80, 80)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-28" rx="7.5" ry="20" fill="#eab308" transform={`rotate(${i * 25.7})`} />
            ))}
            <circle cx="0" cy="0" r="18" fill="#451a03" />
          </g>
        </svg>
      </div>

      {/* BOTTOM-RIGHT LUSH BOTANICAL CORNER */}
      <div className="absolute -bottom-6 -right-6 w-48 md:w-72 h-48 md:h-72 drop-shadow-lg transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 20 C80 20, 150 80, 200 160" stroke="#78350f" strokeWidth="4" opacity="0.6" />
          <path d="M20 40 C80 30, 140 80, 170 140 Z" fill="#15803d" opacity="0.75" />
          <g transform="translate(80, 80)">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-28" rx="7.5" ry="20" fill="#eab308" transform={`rotate(${i * 25.7})`} />
            ))}
            <circle cx="0" cy="0" r="18" fill="#451a03" />
          </g>
        </svg>
      </div>
    </div>
  );
};
