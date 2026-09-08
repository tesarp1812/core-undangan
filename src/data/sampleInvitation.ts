import { InvitationData } from '@/types/invitation';

export const sampleInvitation: InvitationData = {
  slug: "alya-raka",
  title: "The Wedding of Alya & Raka",
  quote: {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    translation: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    reference: "QS. Ar-Rum: 21"
  },
  couple: {
    female: {
      name: "Alya",
      fullName: "Alya Putri, S.Kom.",
      childOf: "Putri pertama dari Bapak Ahmad & Ibu Siti",
      fatherName: "Ahmad",
      motherName: "Siti",
      instagram: "@alyaputri",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
    },
    male: {
      name: "Raka",
      fullName: "Raka Pratama, S.T.",
      childOf: "Putra kedua dari Bapak Budi & Ibu Dewi",
      fatherName: "Budi",
      motherName: "Dewi",
      instagram: "@rakapratama",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    }
  },
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      date: "2026-03-28",
      startTime: "08:00",
      endTime: "10:00",
      timeZone: "WIB",
      venue: "Masjid Agung Batam",
      address: "Jl. Engku Putri, Teluk Tering, Kec. Batam Kota, Kota Batam",
      mapsUrl: "https://maps.google.com"
    },
    {
      id: "resepsi",
      title: "Resepsi Pernikahan",
      date: "2026-03-28",
      startTime: "11:00",
      endTime: "14:00",
      timeZone: "WIB",
      venue: "Grand Ballroom Hotel Harmoni",
      address: "Jl. Jend. Sudirman No. 1, Kota Batam",
      mapsUrl: "https://maps.google.com"
    }
  ],
  gallery: [
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", alt: "Prewedding 1" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800", alt: "Prewedding 2" },
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800", alt: "Prewedding 3" }
  ],
  loveStory: [
    { year: "2021", title: "Pertemuan Pertama", description: "Kami pertama kali bertemu di kampus saat kegiatan organisasi." },
    { year: "2024", title: "Lamaran", description: "Momen berharga di mana keluarga besar kami saling bertemu dan sepakat." },
    { year: "2026", title: "Pernikahan", description: "Awal perjalanan kehidupan baru kami sebagai suami istri." }
  ],
  gifts: [
    {
      id: "bca",
      type: "bank",
      name: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Alya Putri"
    },
    {
      id: "mandiri",
      type: "bank",
      name: "Bank Mandiri",
      accountNumber: "0987654321",
      accountName: "Raka Pratama"
    }
  ],
  theme: "mildness",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};
