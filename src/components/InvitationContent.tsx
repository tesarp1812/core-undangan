'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Copy, Check, Send, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { InvitationData, RsvpSubmission, WishItem } from '@/types/invitation';
import { mildnessTheme } from '@/themes/mildness/theme';

interface InvitationContentProps {
  data: InvitationData;
  guestName?: string;
}

export const InvitationContent: React.FC<InvitationContentProps> = ({ data, guestName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form State
  const [rsvp, setRsvp] = useState<RsvpSubmission>({
    name: guestName || '',
    guestCount: 1,
    status: 'attending'
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Wishes State
  const [wishes, setWishes] = useState<WishItem[]>([
    { id: '1', name: 'Budi & Keluarga', message: 'Selamat Alya & Raka! Semoga menjadi keluarga yang sakinah mawaddah warahmah.', createdAt: '2026-03-01' },
    { id: '2', name: 'Siti Rahma', message: 'Barakallah! Senang sekali dengar kabarnya.', createdAt: '2026-03-02' }
  ]);
  const [newWish, setNewWish] = useState({ name: guestName || '', message: '' });

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date(`${data.events[0]?.date || '2026-03-28'}T${data.events[0]?.startTime || '08:00'}:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.events]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.name || !newWish.message) return;

    setWishes([
      {
        id: Date.now().toString(),
        name: newWish.name,
        message: newWish.message,
        createdAt: 'Baru saja'
      },
      ...wishes
    ]);
    setNewWish({ name: guestName || '', message: '' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-24">
      {/* Background Audio Player */}
      {data.audioUrl && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-amber-800 text-white rounded-full shadow-lg hover:bg-amber-900 transition-all active:scale-95 flex items-center justify-center"
          >
            {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <audio src={data.audioUrl} autoPlay loop={isPlaying} />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-amber-50/50 to-stone-50">
        <span className="text-amber-800 text-sm tracking-widest uppercase mb-2">The Wedding Of</span>
        <h1 className="text-5xl md:text-7xl font-serif text-amber-950 mb-4">
          {data.couple.female.name} & {data.couple.male.name}
        </h1>
        <p className="text-stone-600 font-medium">Sabtu, 28 Maret 2026</p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-3 mt-8 max-w-xs w-full">
          {[
            { label: 'Hari', val: timeLeft.days },
            { label: 'Jam', val: timeLeft.hours },
            { label: 'Menit', val: timeLeft.minutes },
            { label: 'Detik', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/80 p-3 rounded-xl border border-stone-200 shadow-sm text-center">
              <div className="text-xl font-bold text-amber-900">{String(item.val).padStart(2, '0')}</div>
              <div className="text-[10px] text-stone-500 uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-2xl mx-auto my-12 p-6 text-center space-y-4">
        {data.quote.arabic && (
          <p className="text-2xl font-serif text-amber-900 leading-relaxed dir-rtl">{data.quote.arabic}</p>
        )}
        <p className="text-sm text-stone-600 italic">"{data.quote.translation}"</p>
        <p className="text-xs font-semibold text-amber-800">— {data.quote.reference}</p>
      </section>

      {/* Couple Section */}
      <section className="max-w-3xl mx-auto my-16 p-6 space-y-12">
        <h2 className="text-3xl font-serif text-center text-amber-950">Mempelai Pria & Wanita</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center text-center">
          {/* Female */}
          <div className="space-y-3 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
            {data.couple.female.avatarUrl && (
              <img src={data.couple.female.avatarUrl} alt={data.couple.female.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-amber-100" />
            )}
            <h3 className="text-2xl font-serif text-amber-900">{data.couple.female.fullName}</h3>
            <p className="text-xs text-stone-500">{data.couple.female.childOf}</p>
            {data.couple.female.instagram && (
              <a href={`https://instagram.com/${data.couple.female.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-block text-xs text-amber-800 font-medium hover:underline">
                {data.couple.female.instagram}
              </a>
            )}
          </div>

          {/* Male */}
          <div className="space-y-3 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
            {data.couple.male.avatarUrl && (
              <img src={data.couple.male.avatarUrl} alt={data.couple.male.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-amber-100" />
            )}
            <h3 className="text-2xl font-serif text-amber-900">{data.couple.male.fullName}</h3>
            <p className="text-xs text-stone-500">{data.couple.male.childOf}</p>
            {data.couple.male.instagram && (
              <a href={`https://instagram.com/${data.couple.male.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-block text-xs text-amber-800 font-medium hover:underline">
                {data.couple.male.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section className="max-w-3xl mx-auto my-16 p-6 space-y-8">
        <h2 className="text-3xl font-serif text-center text-amber-950">Rangkaian Acara</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {data.events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center">
              <h3 className="text-xl font-semibold text-amber-900">{event.title}</h3>
              <div className="text-sm text-stone-600 space-y-1">
                <p className="font-medium flex items-center justify-center gap-1"><Calendar className="w-4 h-4 text-amber-800" /> {event.date}</p>
                <p>{event.startTime} - {event.endTime} {event.timeZone}</p>
              </div>
              <div className="text-xs text-stone-500 space-y-1 border-t pt-3">
                <p className="font-semibold text-stone-700">{event.venue}</p>
                <p>{event.address}</p>
              </div>
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-900 rounded-lg text-xs font-medium hover:bg-amber-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-4xl mx-auto my-16 p-6 space-y-6">
        <h2 className="text-3xl font-serif text-center text-amber-950">Galeri Foto</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.gallery.map((img, idx) => (
            <img key={idx} src={img.src} alt={img.alt} className="w-full h-48 object-cover rounded-xl border border-stone-200 shadow-sm hover:scale-105 transition-transform duration-300" />
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section className="max-w-xl mx-auto my-16 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-serif text-center text-amber-950">Konfirmasi Kehadiran</h2>
        {rsvpSubmitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-medium">
            Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setRsvpSubmitted(true); }} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Nama</label>
              <input
                type="text"
                required
                value={rsvp.name}
                onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Jumlah Tamu</label>
              <select
                value={rsvp.guestCount}
                onChange={(e) => setRsvp({ ...rsvp, guestCount: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
              >
                {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Orang</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Status Kehadiran</label>
              <select
                value={rsvp.status}
                onChange={(e) => setRsvp({ ...rsvp, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
              >
                <option value="attending">Hadir</option>
                <option value="not_attending">Tidak Hadir</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors">
              Kirim Konfirmasi
            </button>
          </form>
        )}
      </section>

      {/* Wishes Section */}
      <section className="max-w-xl mx-auto my-16 p-6 space-y-6">
        <h2 className="text-2xl font-serif text-center text-amber-950">Ucapan & Doa</h2>
        <form onSubmit={handleAddWish} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3 text-sm">
          <input
            type="text"
            placeholder="Nama Anda"
            required
            value={newWish.name}
            onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
          <textarea
            placeholder="Tuliskan ucapan & doa..."
            required
            rows={3}
            value={newWish.message}
            onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
          <button type="submit" className="w-full py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Kirim Ucapan
          </button>
        </form>

        <div className="space-y-3">
          {wishes.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs text-stone-500">
                <span className="font-semibold text-amber-900">{item.name}</span>
                <span>{item.createdAt}</span>
              </div>
              <p className="text-sm text-stone-700">{item.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gift Section */}
      <section className="max-w-xl mx-auto my-16 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm text-center space-y-6">
        <h2 className="text-2xl font-serif text-amber-950">Kado Digital / Amplop Cashless</h2>
        <p className="text-xs text-stone-500">Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi kado cashless, dapat melalui reknening di bawah ini:</p>
        <div className="space-y-4">
          {data.gifts.map((gift) => (
            <div key={gift.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-amber-900 uppercase">{gift.name}</p>
                <p className="text-sm font-mono font-semibold text-stone-800">{gift.accountNumber}</p>
                <p className="text-[10px] text-stone-500">a.n. {gift.accountName}</p>
              </div>
              <button
                onClick={() => handleCopy(gift.accountNumber, gift.id)}
                className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-amber-200"
              >
                {copiedId === gift.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === gift.id ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-400 space-y-1 mt-20">
        <p>Terima kasih atas kehadiran dan doa restunya.</p>
        <p className="font-serif font-bold text-amber-900">{data.couple.female.name} & {data.couple.male.name}</p>
        <p className="pt-4 text-[10px]">Powered by Core Undangan</p>
      </footer>
    </div>
  );
};
