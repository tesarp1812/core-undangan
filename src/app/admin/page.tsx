'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Key, UserPlus, Copy, Check, Share2, Trash2, Search, Download, Sparkles, RefreshCw, ShieldCheck, Link2, Users, UserCheck, UserX, MessageSquare, CreditCard, Image as ImageIcon, Eye, X } from 'lucide-react';
import defaultGuestsJson from '@/data/guests.json';
import defaultRsvpJson from '@/data/rsvp.json';
import defaultTransfersJson from '@/data/transfers.json';
import defaultWishesJson from '@/data/wishes.json';
import invitationData from '@/data/invitation.json';
import { Guest } from '@/types/guest';
import { RsvpSubmission, WishItem } from '@/types/invitation';
import { TransferRecord } from '@/app/api/transfers/route';

// UUID Generator
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Passcode Default
const ADMIN_PASSCODE = '1234';

export default function AdminPage() {
  // Auth state
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Guests State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestAddress, setNewGuestAddress] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [originUrl, setOriginUrl] = useState('');

  // RSVP Submissions State
  const [rsvpSubmissions, setRsvpSubmissions] = useState<RsvpSubmission[]>([]);

  // Transfer Proof Submissions State
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Wishes State
  const [wishes, setWishes] = useState<WishItem[]>([]);

  // Load initial data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
      const savedPasscodeAuth = localStorage.getItem('core_undangan_admin_auth');
      if (savedPasscodeAuth === 'true') {
        setIsAuthenticated(true);
      }

      // Load Guests from API & LocalStorage fallback
      async function loadGuestsData() {
        try {
          const res = await fetch('/api/guests');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setGuests(data);
              if (typeof window !== 'undefined') {
                localStorage.setItem('core_undangan_guests', JSON.stringify(data));
              }
              return;
            }
          }
        } catch (err) {
          console.log('Error fetching guests from API:', err);
        }

        const savedGuests = localStorage.getItem('core_undangan_guests');
        if (savedGuests) {
          try {
            const parsed = JSON.parse(savedGuests);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setGuests(parsed);
              return;
            }
          } catch {
            setGuests(defaultGuestsJson as Guest[]);
          }
        } else {
          setGuests(defaultGuestsJson as Guest[]);
        }
      }

      // Load RSVP from API & LocalStorage
      async function loadRsvpData() {
        try {
          const res = await fetch('/api/rsvp');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setRsvpSubmissions(data);
              return;
            }
          }
        } catch (err) {
          console.log('Error fetching RSVP from API:', err);
        }

        const savedRsvp = localStorage.getItem('core_undangan_rsvp');
        if (savedRsvp) {
          try {
            setRsvpSubmissions(JSON.parse(savedRsvp));
          } catch {
            setRsvpSubmissions(defaultRsvpJson as RsvpSubmission[]);
          }
        } else {
          setRsvpSubmissions(defaultRsvpJson as RsvpSubmission[]);
        }
      }

      // Load Transfer Proof Submissions from API
      async function loadTransfersData() {
        try {
          const res = await fetch('/api/transfers');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setTransfers(data);
              return;
            }
          }
        } catch (err) {
          console.log('Error fetching transfers from API:', err);
        }
        setTransfers(defaultTransfersJson as TransferRecord[]);
      }

      // Load Wishes from API
      async function loadWishesData() {
        try {
          const res = await fetch('/api/wishes');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setWishes(data);
              return;
            }
          }
        } catch (err) {
          console.log('Error fetching wishes from API:', err);
        }
        setWishes(defaultWishesJson as WishItem[]);
      }

      loadGuestsData();
      loadRsvpData();
      loadTransfersData();
      loadWishesData();
    }
  }, []);

  // Save guests to LocalStorage & Server API
  const saveGuestsList = async (updated: Guest[]) => {
    setGuests(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('core_undangan_guests', JSON.stringify(updated));
    }
    try {
      await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Error syncing guests to API:', err);
    }
  };

  // Handle Auth Verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('core_undangan_admin_auth', 'true');
    } else {
      setAuthError('Kode Akses Salah. Silakan coba lagi!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('core_undangan_admin_auth');
  };

  // Add Guest
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: Guest = {
      id: generateUUID(),
      name: newGuestName.trim(),
      address: newGuestAddress.trim() || undefined
    };

    const updated = [newGuest, ...guests];
    setGuests(updated);
    setNewGuestName('');
    setNewGuestAddress('');

    if (typeof window !== 'undefined') {
      localStorage.setItem('core_undangan_guests', JSON.stringify(updated));
    }

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.guests) setGuests(data.guests);
      }
    } catch (err) {
      console.error('Error adding guest to API:', err);
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (id: string) => {
    if (confirm('Yakin ingin menghapus tamu ini?')) {
      const updated = guests.filter(g => g.id !== id);
      setGuests(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('core_undangan_guests', JSON.stringify(updated));
      }
      try {
        const res = await fetch(`/api/guests?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const data = await res.json();
          if (data.guests) setGuests(data.guests);
        }
      } catch (err) {
        console.error('Error deleting guest from API:', err);
      }
    }
  };

  // Reset to default JSON data
  const handleResetToDefault = async () => {
    if (confirm('Kembalikan daftar tamu ke data default?')) {
      await saveGuestsList(defaultGuestsJson as Guest[]);
    }
  };

  // Toggle Transfer Verification Status
  const handleToggleVerifyTransfer = async (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    try {
      const res = await fetch('/api/transfers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.records) {
          setTransfers(data.records);
        }
      }
    } catch (err) {
      console.error('Error verifying transfer:', err);
    }
  };

  // Delete Transfer Record
  const handleDeleteTransfer = async (id: string) => {
    if (!confirm('Hapus data bukti transfer ini?')) return;
    try {
      const res = await fetch(`/api/transfers?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.records) {
          setTransfers(data.records);
        }
      }
    } catch (err) {
      console.error('Error deleting transfer:', err);
    }
  };

  // Delete Wish Record
  const handleDeleteWish = async (id: string) => {
    if (!confirm('Hapus ucapan ini?')) return;
    try {
      const res = await fetch(`/api/wishes?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wishes) {
          setWishes(data.wishes);
        }
      }
    } catch (err) {
      console.error('Error deleting wish:', err);
    }
  };

  // Reset All Wishes
  const handleResetAllWishes = async () => {
    if (!confirm('Kosongkan SELURUH daftar ucapan & doa dari semua tamu?')) return;
    try {
      const res = await fetch('/api/wishes?reset=true', {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wishes) {
          setWishes(data.wishes);
        }
      }
    } catch (err) {
      console.error('Error resetting wishes:', err);
    }
  };

  // Helper URL generators
  const getGuestUrlByName = (name: string) => `${originUrl || 'http://localhost:3000'}/?to=${encodeURIComponent(name)}`;
  const getGuestUrlById = (id: string) => `${originUrl || 'http://localhost:3000'}/?to=${id}`;

  const handleCopyLink = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // WhatsApp Share
  const handleShareWhatsApp = (guest: Guest) => {
    const url = getGuestUrlById(guest.id);
    const male = invitationData.couple.male;
    const female = invitationData.couple.female;
    const event = invitationData.events[0];

    const text = `Kepada Yth. Bapak/Ibu/Saudara/i
*${guest.name}*
(Di Tempat)

Assalamu’alaikum Warahmatullahi Wabarakatuh

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada acara pernikahan kami:

*${male.fullName} (${male.name})*
&
*${female.fullName} (${female.name})*

Acara insyaAllah akan dilaksanakan pada:
🗓 Hari/Tanggal: ${event.date}
⏰ Waktu: ${event.startTime} ${event.timeZone} – Selesai
📍 Lokasi: ${event.venue} (${event.address})

 Buka Undangan Digital & Detail Acara di Sini: 
👉 ${url} 👈

📍 Petunjuk Lokasi (Google Maps):
${event.mapsUrl}

Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan bagi kami. Mohon maaf apabila undangan ini disampaikan melalui WhatsApp.

Wassalamu’alaikum Warahmatullahi Wabarakatuh

Salam hangat,
*${male.name} & ${female.name} (Beserta Keluarga Besar)*`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guests, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "guests.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Guests
  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.address && g.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // RSVP Recap Calculations
  const attendingSubmissions = rsvpSubmissions.filter(r => r.status === 'attending');
  const notAttendingSubmissions = rsvpSubmissions.filter(r => r.status === 'not_attending');
  const totalAttendingGuests = attendingSubmissions.reduce((sum, r) => sum + (r.guestCount || 1), 0);

  // Lock Screen Render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] text-stone-800 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-amber-200/70 shadow-xl space-y-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-amber-950 font-semibold">Panel Admin Undangan</h1>
            <p className="text-xs text-stone-500 font-normal">Masukkan Kode Akses untuk mengelola tamu</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-700" /> Kode Akses Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Default: 1234"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Masuk ke Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Render
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/70 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h1 className="text-2xl font-serif text-amber-950 font-semibold">Guest Link Generator &amp; Dashboard RSVP</h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">Kelola nama tamu, salin link undangan resmi, dan pantau statistik rekap kehadiran RSVP</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Unduh JSON Tamu
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium transition-all active:scale-95"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* RSVP & TRANSFER RECAP STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Estimasi Rombongan Hadir</p>
              <p className="text-2xl font-bold text-emerald-800 font-serif">{totalAttendingGuests} <span className="text-xs text-stone-500 font-normal">Orang</span></p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-rose-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Tamu Tidak Hadir</p>
              <p className="text-2xl font-bold text-rose-800 font-serif">{notAttendingSubmissions.length} <span className="text-xs text-stone-500 font-normal">Konfirmasi</span></p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-amber-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Total Respon RSVP</p>
              <p className="text-2xl font-bold text-amber-950 font-serif">{rsvpSubmissions.length} <span className="text-xs text-stone-500 font-normal">Respon</span></p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-blue-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Bukti Transfer TF</p>
              <p className="text-2xl font-bold text-blue-950 font-serif">{transfers.length} <span className="text-xs text-stone-500 font-normal">Terkirim</span></p>
            </div>
          </div>
        </div>

        {/* GUEST LINK GENERATOR SECTION */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Add Guest Form */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4 md:col-span-1">
            <h2 className="text-lg font-serif text-amber-950 font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-700" /> Tambah Tamu Baru
            </h2>
            <form onSubmit={handleAddGuest} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Nama Tamu *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Kota / Alamat (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Surabaya"
                  value={newGuestAddress}
                  onChange={(e) => setNewGuestAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95 text-sm"
              >
                + Tambah &amp; Save
              </button>
            </form>
          </div>

          {/* Guest Table & Search */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama atau ID UUID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <button
                onClick={handleResetToDefault}
                className="px-3 py-2 bg-stone-100 text-stone-600 hover:bg-stone-200 text-xs rounded-xl flex items-center justify-center gap-1 border border-stone-200"
                title="Reset Data"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {filteredGuests.length === 0 ? (
                <p className="text-center text-xs text-stone-400 py-8">Tidak ada data tamu yang cocok.</p>
              ) : (
                filteredGuests.map((guest) => {
                  const nameUrl = getGuestUrlByName(guest.name);
                  const idUrl = getGuestUrlById(guest.id);

                  return (
                    <div
                      key={guest.id}
                      className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-amber-950 text-sm">{guest.name}</h3>
                          {guest.address && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                              {guest.address}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-stone-400 select-all">
                          ID: {guest.id}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(nameUrl, `name_${guest.id}`)}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                          title="Salin Link dengan Nama Tamu"
                        >
                          {copiedKey === `name_${guest.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-amber-800" />}
                          {copiedKey === `name_${guest.id}` ? 'Tersalin' : 'Salin Link Nama'}
                        </button>

                        <button
                          onClick={() => handleCopyLink(idUrl, `id_${guest.id}`)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                          title="Salin Link dengan ID Tamu"
                        >
                          {copiedKey === `id_${guest.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                          {copiedKey === `id_${guest.id}` ? 'Tersalin' : 'Salin ID'}
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(guest)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                          title="Kirim Pesan WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" /> WhatsApp
                        </button>

                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* DETAILED RSVP SUBMISSIONS TABLE */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-amber-950 font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-700" /> Rekap Jawaban Konfirmasi Kehadiran (RSVP)
            </h2>
            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium">
              {rsvpSubmissions.length} Data Masuk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-200/80 bg-amber-50/50 text-stone-700">
                  <th className="p-3 font-semibold rounded-l-xl">Nama Tamu</th>
                  <th className="p-3 font-semibold">Status Kehadiran</th>
                  <th className="p-3 font-semibold">Jumlah Rombongan</th>
                  <th className="p-3 font-semibold rounded-r-xl">Waktu Konfirmasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rsvpSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-stone-400">Belum ada data RSVP yang masuk.</td>
                  </tr>
                ) : (
                  rsvpSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3 font-semibold text-amber-950">{submission.name}</td>
                      <td className="p-3">
                        {submission.status === 'attending' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium inline-flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> Hadir
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-medium inline-flex items-center gap-1">
                            <UserX className="w-3 h-3" /> Tidak Hadir
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-stone-700">{submission.guestCount || 1} Orang</td>
                      <td className="p-3 text-stone-400">{submission.createdAt || 'Baru saja'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILED TRANSFER PROOF TABLE / GALLERY */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-blue-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-amber-950 font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-700" /> Rekap Upload Bukti Transfer TF (Digital Gift)
            </h2>
            <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-medium">
              {transfers.length} Bukti Masuk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-blue-200/80 bg-blue-50/50 text-stone-700">
                  <th className="p-3 font-semibold rounded-l-xl">Preview Bukti</th>
                  <th className="p-3 font-semibold">Nama Pengirim</th>
                  <th className="p-3 font-semibold">Nominal TF</th>
                  <th className="p-3 font-semibold">Catatan / Doa</th>
                  <th className="p-3 font-semibold">Waktu Kirim</th>
                  <th className="p-3 font-semibold">Status Admin</th>
                  <th className="p-3 font-semibold rounded-r-xl">Aksi Konfirmasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-stone-400">Belum ada bukti transfer yang diupload oleh tamu.</td>
                  </tr>
                ) : (
                  transfers.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3">
                        <div
                          onClick={() => setPreviewImage(item.proofDataUrl)}
                          className="w-14 h-14 rounded-xl border border-stone-200 bg-stone-100 overflow-hidden relative group cursor-pointer shadow-sm hover:ring-2 hover:ring-amber-500 transition-all"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.proofDataUrl}
                            alt={`Bukti TF - ${item.senderName}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-amber-950">{item.senderName}</td>
                      <td className="p-3 font-medium text-emerald-700">{item.amount ? `Rp ${item.amount}` : '-'}</td>
                      <td className="p-3 text-stone-600 max-w-xs italic">{item.notes || '-'}</td>
                      <td className="p-3 text-stone-400 whitespace-nowrap">{item.createdAt}</td>
                      <td className="p-3">
                        {item.status === 'verified' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Terkonfirmasi Sah
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-medium inline-flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin-slow" /> Menunggu Konfirmasi
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVerifyTransfer(item.id, item.status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1 ${item.status === 'verified'
                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                              }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {item.status === 'verified' ? 'Batalkan' : 'Konfirmasi Sah'}
                          </button>
                          <button
                            onClick={() => handleDeleteTransfer(item.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Hapus Bukti Transfer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILED WISHES & DOA TABLE */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-amber-950 font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-700" /> Rekap &amp; Kelola Ucapan &amp; Doa
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium">
                {wishes.length} Ucapan
              </span>
              {wishes.length > 0 && (
                <button
                  onClick={handleResetAllWishes}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kosongkan Semua Ucapan
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-200/80 bg-amber-50/50 text-stone-700">
                  <th className="p-3 font-semibold rounded-l-xl">Nama Tamu</th>
                  <th className="p-3 font-semibold">Pesan Ucapan &amp; Doa</th>
                  <th className="p-3 font-semibold">Waktu Pengiriman</th>
                  <th className="p-3 font-semibold rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {wishes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-stone-400">Belum ada ucapan &amp; doa yang masuk.</td>
                  </tr>
                ) : (
                  wishes.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3 font-semibold text-amber-950 whitespace-nowrap">{item.name}</td>
                      <td className="p-3 text-stone-700 max-w-md italic">{item.message}</td>
                      <td className="p-3 text-stone-400 whitespace-nowrap">{item.createdAt}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteWish(item.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Ucapan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LIGHTBOX IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden p-2 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white hover:bg-black/90 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Bukti Transfer Zoom"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <p className="text-xs text-stone-400 mt-2">Klik area di luar foto untuk menutup</p>
          </div>
        </div>
      )}
    </div>
  );
}
