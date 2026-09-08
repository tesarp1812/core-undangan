'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Copy, Check, Send, Volume2, VolumeX, Sparkles, Clock, CalendarPlus, UserCheck, Upload, Image as ImageIcon, MessageCircle, X } from 'lucide-react';
import { InvitationData, RsvpSubmission, WishItem } from '@/types/invitation';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ContentFloralFrame } from '@/components/ContentFloralFrame';
import { FloatingPetals } from '@/components/FloatingPetals';

interface InvitationContentProps {
  data: InvitationData;
  guestName?: string;
  autoPlayAudio?: boolean;
}

export const InvitationContent: React.FC<InvitationContentProps> = ({ data, guestName, autoPlayAudio = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlayAudio);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form State
  const [rsvp, setRsvp] = useState<RsvpSubmission>({
    name: guestName || '',
    guestCount: 1,
    status: 'attending'
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Wishes State (Persisten via /api/wishes)
  const [wishes, setWishes] = useState<WishItem[]>([
    { id: '1', name: 'Budi Santoso', message: 'Selamat Fia & Rizah! Semoga menjadi keluarga yang sakinah mawaddah warahmah.', createdAt: 'Minggu, 20 September 2026' },
    { id: '2', name: 'Siti Rahma', message: 'Barakallah! Selamat menempuh hidup baru.', createdAt: 'Minggu, 20 September 2026' }
  ]);
  const [newWish, setNewWish] = useState({ name: guestName || '', message: '' });
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Transfer Proof Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [tfSenderName, setTfSenderName] = useState(guestName || '');
  const [tfAmount, setTfAmount] = useState('');
  const [tfImageBase64, setTfImageBase64] = useState<string | null>(null);
  const [tfNotes, setTfNotes] = useState('');
  const [isSubmittingTf, setIsSubmittingTf] = useState(false);
  const [tfSubmitted, setTfSubmitted] = useState(false);

  // Sync guestName prop with state if changed
  useEffect(() => {
    if (guestName) {
      setRsvp(prev => ({ ...prev, name: guestName }));
      setNewWish(prev => ({ ...prev, name: guestName }));
      setTfSenderName(guestName);
    }
  }, [guestName]);

  // Load persistent wishes from API & LocalStorage
  useEffect(() => {
    async function loadWishes() {
      try {
        const res = await fetch('/api/wishes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setWishes(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem('core_undangan_wishes', JSON.stringify(data));
            }
            return;
          }
        }
      } catch (err) {
        console.log('Failed to fetch wishes from API, using fallback:', err);
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('core_undangan_wishes');
        if (saved) {
          try {
            setWishes(JSON.parse(saved));
          } catch { }
        }
      }
    }

    loadWishes();
  }, []);

  // Audio Playback Handler
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Audio autoplay prevented by browser policy:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Countdown logic (Target: 20 September 2026 08:00 WIB)
  useEffect(() => {
    const targetDate = new Date('2026-09-20T08:00:00').getTime();

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
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Submit RSVP to API so admin can view attendance summary
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvp.name.trim() || isSubmittingRsvp) return;

    setIsSubmittingRsvp(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rsvp.name.trim(),
          guestCount: rsvp.guestCount,
          status: rsvp.status
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== 'undefined' && data.submissions) {
          localStorage.setItem('core_undangan_rsvp', JSON.stringify(data.submissions));
        }
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    } finally {
      setIsSubmittingRsvp(false);
      setRsvpSubmitted(true);
    }
  };

  // Submit new wish to API so ALL guests see it
  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.name.trim() || !newWish.message.trim() || isSubmittingWish) return;

    setIsSubmittingWish(true);

    const wishPayload = {
      name: newWish.name.trim(),
      message: newWish.message.trim()
    };

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wishPayload)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.wishes) {
          setWishes(result.wishes);
          if (typeof window !== 'undefined') {
            localStorage.setItem('core_undangan_wishes', JSON.stringify(result.wishes));
          }
        }
      } else {
        const fallbackItem: WishItem = {
          id: Date.now().toString(),
          name: wishPayload.name,
          message: wishPayload.message,
          createdAt: 'Baru saja'
        };
        const updated = [fallbackItem, ...wishes];
        setWishes(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('core_undangan_wishes', JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error('Error posting wish:', err);
      const fallbackItem: WishItem = {
        id: Date.now().toString(),
        name: wishPayload.name,
        message: wishPayload.message,
        createdAt: 'Baru saja'
      };
      const updated = [fallbackItem, ...wishes];
      setWishes(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('core_undangan_wishes', JSON.stringify(updated));
      }
    } finally {
      setIsSubmittingWish(false);
      setNewWish({ name: guestName || '', message: '' });
    }
  };

  // Handle Image File Selection for Transfer Proof
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTfImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Transfer Proof to API & Admin Panel
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tfSenderName.trim() || !tfImageBase64 || isSubmittingTf) return;

    setIsSubmittingTf(true);

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: tfSenderName.trim(),
          amount: tfAmount.trim(),
          proofDataUrl: tfImageBase64,
          notes: tfNotes.trim()
        })
      });

      if (res.ok) {
        setTfSubmitted(true);
      }
    } catch (err) {
      console.error('Error uploading transfer proof:', err);
    } finally {
      setIsSubmittingTf(false);
    }
  };

  // WhatsApp Transfer Confirmation Handler
  const handleWhatsAppTfConfirm = (accountName: string, bankName: string) => {
    const name = guestName || 'Tamu Undangan';
    const text = `Halo Fia & Rizah, saya *${name}* telah melakukan transfer kado digital via *${bankName}* (${accountName}).\n\nBerikut saya kirimkan screenshot bukti transfernya:`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Helper Google Calendar Link
  const createGoogleCalendarLink = (title: string, date: string, startTime: string, endTime: string, venue: string, address: string) => {
    const dates = '20260920T010000Z/20260920T050000Z';
    const details = encodeURIComponent(`Acara ${title} Pernikahan Fia & Rizah\nLokasi: ${venue} - ${address}`);
    const location = encodeURIComponent(`${venue}, ${address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title + ' Fia & Rizah')}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans pb-24 overflow-x-hidden relative">
      {/* Dynamic Animated Decorative Layers */}
      <ContentFloralFrame />
      <FloatingPetals />

      {/* Ambient Background Gradient Glows */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-50/40 via-stone-50/20 to-amber-50/30 pointer-events-none -z-10" />
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Audio Player */}
      {data.audioUrl && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="group relative p-3.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center border border-amber-600/30"
            title={isPlaying ? 'Matikan Musik' : 'Putar Musik'}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse text-amber-200" />
            ) : (
              <VolumeX className="w-5 h-5 text-amber-300/70" />
            )}
          </button>
          <audio ref={audioRef} src={data.audioUrl} loop />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-[#fdfbf7] border-b border-amber-200/50">
        <ScrollReveal direction="down">
          <span className="tracking-[0.25em] uppercase text-xs text-amber-800 font-semibold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            The Wedding Of
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-amber-950 mb-4 tracking-tight font-normal">
            {data.couple.female.name} <span className="text-amber-700 font-serif italic">&amp;</span> {data.couple.male.name}
          </h1>
          <p className="text-stone-600 font-medium text-sm md:text-base tracking-widest uppercase">
            {data.events[0]?.date || 'Minggu, 20 September 2026'}
          </p>
        </ScrollReveal>

        {/* Countdown Box */}
        <ScrollReveal direction="up" delay={150} className="w-full max-w-xs mt-10">
          <div className="grid grid-cols-4 gap-2.5 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-amber-200/70 shadow-sm">
            {[
              { label: 'Hari', val: timeLeft.days },
              { label: 'Jam', val: timeLeft.hours },
              { label: 'Menit', val: timeLeft.minutes },
              { label: 'Detik', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/40 text-center">
                <div className="text-lg font-bold text-amber-900 font-mono">{String(item.val).padStart(2, '0')}</div>
                <div className="text-[9px] text-stone-500 uppercase tracking-wider font-medium mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Quote Section */}
      <section className="max-w-2xl mx-auto my-20 px-6 text-center relative z-10">
        <ScrollReveal direction="up">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-amber-200/60 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            {data.quote.arabic && (
              <p className="text-2xl md:text-3xl font-serif text-amber-900 leading-loose dir-rtl">{data.quote.arabic}</p>
            )}
            <p className="text-sm text-stone-600 font-normal italic leading-relaxed font-serif">"{data.quote.translation}"</p>
            <p className="text-xs font-semibold text-amber-800 tracking-wider">— {data.quote.reference}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Couple Section */}
      <section className="max-w-4xl mx-auto my-24 px-6 space-y-12 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-950 tracking-tight font-normal">
            Mempelai Pria &amp; Wanita
          </h2>
          <div className="w-12 h-[2px] bg-amber-600/50 mx-auto mt-2" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Female Bride */}
          <ScrollReveal direction="left" delay={100}>
            <div className="h-full space-y-4 p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between">
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="w-48 h-60 rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-stone-50 p-2 shadow-inner flex items-center justify-center">
                  <img
                    src={data.couple.female.avatarUrl}
                    alt={data.couple.female.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-amber-950 font-medium">{data.couple.female.fullName}</h3>
                  <p className="text-xs text-stone-500 font-normal mt-1.5 max-w-xs mx-auto">{data.couple.female.childOf}</p>
                </div>
              </div>
              {data.couple.female.instagram && (
                <a
                  href={`https://instagram.com/${data.couple.female.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs text-amber-800 hover:text-amber-900 font-medium tracking-wide underline underline-offset-4"
                >
                  {data.couple.female.instagram}
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Male Groom */}
          <ScrollReveal direction="right" delay={200}>
            <div className="h-full space-y-4 p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-between">
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="w-48 h-60 rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-stone-50 p-2 shadow-inner flex items-center justify-center">
                  <img
                    src={data.couple.male.avatarUrl}
                    alt={data.couple.male.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-amber-950 font-medium">{data.couple.male.fullName}</h3>
                  <p className="text-xs text-stone-500 font-normal mt-1.5 max-w-xs mx-auto">{data.couple.male.childOf}</p>
                </div>
              </div>
              {data.couple.male.instagram && (
                <a
                  href={`https://instagram.com/${data.couple.male.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs text-amber-800 hover:text-amber-900 font-medium tracking-wide underline underline-offset-4"
                >
                  {data.couple.male.instagram}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Event Section */}
      <section className="max-w-4xl mx-auto my-24 px-6 space-y-10 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-950 tracking-tight font-normal">
            Rangkaian Acara
          </h2>
          <div className="w-12 h-[2px] bg-amber-600/50 mx-auto mt-2" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {data.events.map((event, idx) => (
            <ScrollReveal key={event.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 150}>
              <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h3 className="text-2xl font-serif text-amber-950 text-center font-medium">{event.title}</h3>
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>

                  <div className="text-xs text-stone-600 space-y-1.5 text-center border-y border-amber-100 py-3">
                    <p className="font-semibold flex items-center justify-center gap-1.5 text-sm text-amber-900">
                      <Calendar className="w-4 h-4 text-amber-700" /> {event.date}
                    </p>
                    <p className="flex items-center justify-center gap-1 font-medium text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-amber-700" /> {event.startTime} - {event.endTime} {event.timeZone}
                    </p>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 text-center">
                    <p className="font-semibold text-stone-800">{event.venue}</p>
                    <p className="font-normal text-stone-500 leading-relaxed">{event.address}</p>
                  </div>
                </div>

                {/* Google Maps Embed */}
                {event.mapsEmbedUrl && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-amber-200/70 shadow-inner my-2">
                    <iframe
                      src={event.mapsEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Peta Lokasi ${event.title}`}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-medium transition-all shadow-sm active:scale-95 w-full"
                  >
                    <MapPin className="w-4 h-4" /> Buka Google Maps
                  </a>
                  <a
                    href={createGoogleCalendarLink(event.title, event.date, event.startTime, event.endTime, event.venue, event.address)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl text-xs font-medium transition-all active:scale-95 w-full"
                  >
                    <CalendarPlus className="w-4 h-4 text-amber-800" /> Simpan ke Google Calendar
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RSVP Section (Persisten via /api/rsvp) */}
      <section className="max-w-xl mx-auto my-24 px-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-amber-200/60 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-serif text-center text-amber-950 font-medium">Konfirmasi Kehadiran (RSVP)</h2>
            {rsvpSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center text-sm font-medium space-y-1">
                <p className="font-bold flex items-center justify-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Konfirmasi Tersimpan
                </p>
                <p className="text-xs text-emerald-700 font-normal">
                  Terima kasih! Konfirmasi kehadiran Anda telah tersimpan dan tercatat pada sistem kami.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={rsvp.name}
                    onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Jumlah Tamu Rombongan</label>
                  <select
                    value={rsvp.guestCount}
                    onChange={(e) => setRsvp({ ...rsvp, guestCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  >
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Orang</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Status Kehadiran</label>
                  <select
                    value={rsvp.status}
                    onChange={(e) => setRsvp({ ...rsvp, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  >
                    <option value="attending">Hadir</option>
                    <option value="not_attending">Tidak Hadir</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95"
                >
                  {isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi Kehadiran'}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Gift Section & Transfer Proof Confirmation */}
      <section className="max-w-xl mx-auto my-24 px-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-amber-200/60 shadow-sm text-center space-y-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-serif text-amber-950 font-medium">Kado Digital / Cashless</h2>
            <p className="text-xs text-stone-500 font-normal leading-relaxed">
              Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi kado cashless, dapat melalui rekening di bawah ini:
            </p>
            <div className="space-y-4">
              {data.gifts.map((gift) => (
                <div key={gift.id} className="p-5 bg-stone-50/80 rounded-2xl border border-amber-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-left space-y-0.5">
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">{gift.name}</p>
                      <p className="text-base font-mono font-semibold text-stone-800">{gift.accountNumber}</p>
                      <p className="text-[11px] text-stone-500 font-medium">a.n. {gift.accountName}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(gift.accountNumber, gift.id)}
                      className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      {copiedId === gift.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
                      {copiedId === gift.id ? 'Tersalin' : 'Salin Rekening'}
                    </button>
                  </div>

                  {/* Transfer Action Buttons: WhatsApp & Upload Form Modal */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/40">
                    <button
                      onClick={() => handleWhatsAppTfConfirm(gift.accountName, gift.name)}
                      className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Confirm WhatsApp
                    </button>
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="px-3 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Bukti TF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Wishes Section (Persisten via /api/wishes) */}
      <section className="max-w-xl mx-auto my-24 px-6 space-y-6 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-2xl font-serif text-center text-amber-950 font-medium">Ucapan &amp; Doa</h2>
          <form onSubmit={handleAddWish} className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/60 shadow-sm space-y-3 text-sm mt-6">
            <input
              type="text"
              placeholder="Nama Anda"
              required
              value={newWish.name}
              onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
            <textarea
              placeholder="Tuliskan ucapan & doa..."
              required
              rows={3}
              value={newWish.message}
              onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
            <button
              type="submit"
              disabled={isSubmittingWish}
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" /> {isSubmittingWish ? 'Mengirim...' : 'Kirim Ucapan (Tampil ke Semua Tamu)'}
            </button>
          </form>

          <div className="space-y-3 mt-6">
            {wishes.map((item) => (
              <div key={item.id} className="bg-white/90 p-4.5 rounded-2xl border border-amber-200/60 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs text-amber-900">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{item.createdAt}</span>
                </div>
                <p className="text-sm text-stone-700 font-normal leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* TRANSFER PROOF UPLOAD MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-amber-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => { setShowTransferModal(false); setTfSubmitted(false); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-amber-950 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-700" /> Upload Bukti Transfer TF
            </h3>

            {tfSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-3">
                <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-base">Bukti Transfer Berhasil Dikirim!</p>
                <p className="text-xs text-emerald-700 leading-relaxed font-normal">
                  Terima kasih banyak atas kado dan doa restunya. Bukti transfer Anda telah tersimpan dan tercatat pada sistem kami.
                </p>
                <button
                  onClick={() => { setShowTransferModal(false); setTfSubmitted(false); }}
                  className="mt-2 px-6 py-2 bg-emerald-700 text-white font-medium rounded-xl text-xs"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nama Pengirim Transfer *</label>
                  <input
                    type="text"
                    required
                    value={tfSenderName}
                    onChange={(e) => setTfSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nominal (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 500.000"
                    value={tfAmount}
                    onChange={(e) => setTfAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Pilih Foto Screenshot TF *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageSelect}
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                  />
                </div>

                {tfImageBase64 && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-amber-200 bg-stone-50 p-1 flex items-center justify-center">
                    <img src={tfImageBase64} alt="Preview Bukti Transfer" className="h-full object-contain" />
                  </div>
                )}

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Catatan / Pesan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Pesan tambahan untuk mempelai..."
                    value={tfNotes}
                    onChange={(e) => setTfNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTf || !tfImageBase64}
                  className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  {isSubmittingTf ? 'Mengirim Foto...' : 'Kirim Bukti Transfer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-stone-400 space-y-2 mt-24 pb-8 relative z-10">
        <ScrollReveal direction="up">
          <p className="font-normal">Terima kasih atas kehadiran dan doa restunya.</p>
          <p className="font-serif font-semibold text-amber-900 text-sm">{data.couple.female.name} &amp; {data.couple.male.name}</p>
          <p className="pt-4 text-[10px] text-stone-400">Powered by Tamatech</p>
        </ScrollReveal>
      </footer>
    </div>
  );
};
