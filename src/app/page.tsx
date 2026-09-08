'use client';

import React, { useState } from 'react';
import { sampleInvitation } from '@/data/sampleInvitation';
import { Cover } from '@/components/Cover';
import { InvitationContent } from '@/components/InvitationContent';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-stone-100 selection:bg-amber-200 selection:text-amber-900">
      {!isOpen && (
        <Cover
          data={sampleInvitation}
          guestName="Bapak/Ibu/Saudara/i"
          onOpen={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <InvitationContent
          data={sampleInvitation}
          guestName="Bapak/Ibu/Saudara/i"
        />
      )}
    </main>
  );
}
