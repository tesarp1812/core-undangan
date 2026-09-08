import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultGuests from '@/data/guests.json';
import { Guest } from '@/types/guest';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src/data/guests.json');

function getStoredGuests(): Guest[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading guests file:', err);
  }
  return defaultGuests as Guest[];
}

function saveGuests(guests: Guest[]) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(guests, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing guests file:', err);
  }
}

export async function GET() {
  const guests = getStoredGuests();
  return NextResponse.json(guests);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if body is full array (for bulk update or reset)
    if (Array.isArray(body)) {
      saveGuests(body);
      return NextResponse.json({ success: true, guests: body });
    }

    const { id, name, address } = body;
    if (!id || !name) {
      return NextResponse.json({ error: 'ID dan Nama Tamu wajib diisi' }, { status: 400 });
    }

    const currentGuests = getStoredGuests();
    const newGuest: Guest = {
      id: id.trim(),
      name: name.trim(),
      address: address ? address.trim() : undefined
    };

    const updatedGuests = [newGuest, ...currentGuests];
    saveGuests(updatedGuests);

    return NextResponse.json({ success: true, guests: updatedGuests });
  } catch (err) {
    console.error('API Guests POST Error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan data tamu' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID tamu wajib diisi' }, { status: 400 });
    }

    const currentGuests = getStoredGuests();
    const updatedGuests = currentGuests.filter(g => g.id !== id);

    saveGuests(updatedGuests);
    return NextResponse.json({ success: true, guests: updatedGuests });
  } catch (err) {
    console.error('API Guests DELETE Error:', err);
    return NextResponse.json({ error: 'Gagal menghapus tamu' }, { status: 500 });
  }
}
