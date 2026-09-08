export interface CoupleMember {
  name: string;
  fullName: string;
  childOf: string;
  fatherName?: string;
  motherName?: string;
  instagram?: string;
  avatarUrl?: string;
}

export interface Couple {
  female: CoupleMember;
  male: CoupleMember;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone?: string;
  venue: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl?: string;
  calendarTitle?: string;
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface GiftAccount {
  id: string;
  type: 'bank' | 'qris' | 'wallet';
  name: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl?: string;
}

export interface RsvpSubmission {
  id?: string;
  name: string;
  guestCount: number;
  status: 'attending' | 'not_attending';
  createdAt?: string;
}

export interface WishItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface Quote {
  arabic?: string;
  translation: string;
  reference: string;
}

export interface InvitationData {
  slug: string;
  title: string;
  quote: Quote;
  couple: Couple;
  events: EventItem[];
  gallery: GalleryItem[];
  loveStory: LoveStoryItem[];
  gifts: GiftAccount[];
  theme: string;
  audioUrl?: string;
  liveStreamingUrl?: string;
  instagramStoryTemplateUrl?: string;
}
