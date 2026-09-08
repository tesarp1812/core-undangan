'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number; // percentage 0-100
  size: number; // px size 12-24
  duration: number; // seconds 6-12
  delay: number; // seconds 0-5
  rotation: number; // deg
  opacity: number;
}

export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setReducedMotion(true);
        return;
      }
    }

    // Generate 14 random petals
    const generated: Petal[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      size: 12 + Math.random() * 14,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 6,
      rotation: Math.random() * 360,
      opacity: 0.4 + Math.random() * 0.5,
    }));

    setPetals(generated);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <style jsx>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-5vh) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(40px);
            opacity: 0;
          }
        }

        .petal-item {
          position: absolute;
          top: -20px;
          animation-name: floatDown;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-item"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
          }}
        >
          {/* Flower Petal SVG */}
          <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            <path
              d="M15 0 C25 10, 30 25, 15 40 C0 25, 5 10, 15 0 Z"
              fill={petal.id % 2 === 0 ? '#fde047' : '#f59e0b'}
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
