'use client';

import React, { useState } from 'react';
import { MailOpen, Heart, Sparkles } from 'lucide-react';
import { InvitationData } from '@/types/invitation';
import { CoverFloralFrame } from '@/components/CoverFloralFrame';

interface CoverProps {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
}

export const Cover: React.FC<CoverProps> = ({ data, guestName, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    // Jalankan animasi exit out 500ms sebelum membuka undangan
    setTimeout(() => {
      onOpen();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#fdfbf7] text-stone-800 text-center transition-all duration-700 overflow-hidden ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cover Floral Frame (Hanya di area kosong luar, tidak menutupi teks, dilengkapi animasi In/Out) */}
      <CoverFloralFrame isOpening={isOpening} />

      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Subtle Border Frame */}
      <div className="absolute inset-4 md:inset-8 border border-stone-300/60 rounded-3xl pointer-events-none -z-5" />

      {/* Top Header */}
      <div className="mt-10 space-y-2 relative z-30">
        <span className="tracking-[0.25em] uppercase text-xs text-amber-800 font-semibold flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          The Wedding Of
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tight font-normal drop-shadow-sm">
          {data.couple.female.name} <span className="text-amber-700 font-serif italic">&amp;</span> {data.couple.male.name}
        </h1>
        <p className="text-xs text-stone-600 tracking-widest font-medium">
          {data.events[0]?.date}
        </p>
      </div>

      {/* Center Guest Invitation Card (Always above flowers) */}
      <div className="my-auto space-y-4 max-w-sm w-full bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-amber-300/80 shadow-xl shadow-amber-900/10 relative z-30 hover:shadow-2xl transition-shadow duration-300">
        <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Kepada Yth. Bapak/Ibu/Saudara/i</p>

        <div className="py-2.5 border-y border-amber-200/80">
          <h2 className="text-2xl font-serif font-bold text-amber-950 capitalize">
            {guestName || 'Tamu Undangan'}
          </h2>
        </div>

        <p className="text-xs text-stone-400">Di Tempat</p>

        <button
          onClick={handleOpenClick}
          className="mt-6 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-full font-medium text-sm transition-all duration-200 shadow-md shadow-amber-900/20 active:scale-95 group"
        >
          <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
          Buka Undangan
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="mb-4 text-[11px] text-stone-500 font-light relative z-30 flex items-center gap-1.5 justify-center">
        <Heart className="w-3 h-3 text-amber-600/70" />
        <p>Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
      </div>
    </div>
  );
};
