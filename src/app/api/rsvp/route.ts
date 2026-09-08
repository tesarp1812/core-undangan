import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultRsvp from '@/data/rsvp.json';
import { RsvpSubmission } from '@/types/invitation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src/data/rsvp.json');

function getStoredRsvp(): RsvpSubmission[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading rsvp file:', err);
  }
  return defaultRsvp as RsvpSubmission[];
}

function saveRsvp(submissions: RsvpSubmission[]) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing rsvp file:', err);
  }
}

export async function GET() {
  const submissions = getStoredRsvp();
  return NextResponse.json(submissions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, guestCount, status } = body;

    if (!name || !status) {
      return NextResponse.json({ error: 'Nama dan status wajib diisi' }, { status: 400 });
    }

    const currentRsvp = getStoredRsvp();

    const newSubmission: RsvpSubmission = {
      id: Date.now().toString(),
      name: name.trim(),
      guestCount: Number(guestCount) || 1,
      status: status === 'not_attending' ? 'not_attending' : 'attending',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedRsvp = [newSubmission, ...currentRsvp];
    saveRsvp(updatedRsvp);

    return NextResponse.json({ success: true, submissions: updatedRsvp });
  } catch (err) {
    console.error('API RSVP POST Error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan konfirmasi' }, { status: 500 });
  }
}
