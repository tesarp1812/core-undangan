'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
