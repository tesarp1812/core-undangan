'use client';

import React, { useState } from 'react';
import { MailOpen, Music } from 'lucide-react';
import { InvitationData } from '@/types/invitation';

interface CoverProps {
  data: InvitationData;
  guestName?: string;
  onOpen: () => void;
}

export const Cover: React.FC<CoverProps> = ({ data, guestName, onOpen }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-stone-100 text-stone-800 text-center transition-transform duration-700">
      <div className="mt-12 space-y-2">
        <p className="tracking-widest uppercase text-xs text-amber-800 font-medium">The Wedding Of</p>
        <h1 className="text-4xl md:text-5xl font-serif text-amber-900">
          {data.couple.female.name} & {data.couple.male.name}
        </h1>
      </div>

      <div className="my-auto space-y-4 max-w-sm w-full bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-stone-200 shadow-sm">
        <p className="text-xs text-stone-500">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <h2 className="text-xl font-semibold text-amber-900 capitalize">
          {guestName || 'Tamu Undangan'}
        </h2>
        <p className="text-xs text-stone-400">Di Tempat</p>

        <button
          onClick={onOpen}
          className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-medium text-sm transition-all shadow-md active:scale-95"
        >
          <MailOpen className="w-4 h-4" />
          Buka Undangan
        </button>
      </div>

      <div className="mb-6 text-xs text-stone-400">
        <p>Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
      </div>
    </div>
  );
};
