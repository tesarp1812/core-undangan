'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';
import invitationDataJson from '@/data/invitation.json';
import defaultGuestsDataJson from '@/data/guests.json';
import { InvitationData } from '@/types/invitation';
import { Guest } from '@/types/guest';
import { Cover } from '@/components/Cover';
import { InvitationContent } from '@/components/InvitationContent';

const invitationData = invitationDataJson as unknown as InvitationData;

function InvitationView() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestsList, setGuestsList] = useState<Guest[]>(defaultGuestsDataJson as Guest[]);
  const searchParams = useSearchParams();

  // Load guests list from LocalStorage if available (to sync with /admin updates)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGuests = localStorage.getItem('core_undangan_guests');
      if (savedGuests) {
        try {
          const parsed = JSON.parse(savedGuests);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGuestsList(parsed);
          }
        } catch {
          // fallback to default
        }
      }
    }
  }, []);

  // Read query params: 'to', 'id', or 'name'
  const paramValue = searchParams.get('to') || searchParams.get('id') || searchParams.get('name') || '';

  // Block access if no parameter request is provided
  if (!paramValue.trim()) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] text-stone-800 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-amber-200/80 shadow-xl text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto text-amber-800 shadow-sm">
            <Lock className="w-8 h-8 text-amber-800" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-amber-950 font-semibold">Tautan Undangan Tidak Ditemukan</h1>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Mohon maaf, halaman undangan ini bersifat pribadi dan hanya dapat diakses melalui <strong>tautan khusus</strong> yang telah dikirimkan kepada Anda.
            </p>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-left space-y-2 text-xs text-stone-700">
            <p className="font-semibold text-amber-950 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              Petunjuk Akses:
            </p>
            <p className="text-[11px] leading-relaxed text-stone-600">
              Silakan buka kembali link undangan yang dikirimkan oleh pengantin melalui pesan singkat WhatsApp (contoh: <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono">?to=nama-tamu</code>).
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 font-serif italic">
            Undangan Pernikahan Fia &amp; Rizah
          </div>
        </div>
      </div>
    );
  }

  let resolvedGuestName = '';

  if (paramValue) {
    const cleanParam = paramValue.trim();

    // 1. Check if cleanParam matches guest ID (UUID)
    const foundById = guestsList.find(g => g.id.toLowerCase() === cleanParam.toLowerCase());

    if (foundById) {
      resolvedGuestName = foundById.name;
    } else {
      // 2. Check if cleanParam matches guest Name
      const foundByName = guestsList.find(g => g.name.toLowerCase() === cleanParam.toLowerCase());

      if (foundByName) {
        resolvedGuestName = foundByName.name;
      } else {
        // 3. Fallback: If paramValue is not a 36-char UUID, treat it directly as the Guest Name
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParam);
        if (!isUUID) {
          resolvedGuestName = cleanParam;
        } else {
          // If it is an unlisted UUID, fallback to generic
          resolvedGuestName = 'Tamu Undangan';
        }
      }
    }
  }

  return (
    <main className="relative min-h-screen bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      {!isOpen && (
        <Cover
          data={invitationData}
          guestName={resolvedGuestName}
          onOpen={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <InvitationContent
          data={invitationData}
          guestName={resolvedGuestName}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500 font-serif">Memuat Undangan...</div>}>
      <InvitationView />
    </Suspense>
  );
}
