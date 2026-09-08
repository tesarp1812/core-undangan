import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultWishes from '@/data/wishes.json';
import { WishItem } from '@/types/invitation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src/data/wishes.json');

function getStoredWishes(): WishItem[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading wishes file:', err);
  }
  return defaultWishes as WishItem[];
}

function saveWishes(wishes: WishItem[]) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing wishes file:', err);
  }
}

export async function GET() {
  const wishes = getStoredWishes();
  return NextResponse.json(wishes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'Nama dan ucapan wajib diisi' }, { status: 400 });
    }

    const currentWishes = getStoredWishes();

    const newWish: WishItem = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedWishes = [newWish, ...currentWishes];
    saveWishes(updatedWishes);

    return NextResponse.json({ success: true, wishes: updatedWishes });
  } catch (err) {
    console.error('API Wishes POST Error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan ucapan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reset = searchParams.get('reset');

    if (reset === 'true') {
      saveWishes([]);
      return NextResponse.json({ success: true, wishes: [] });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID ucapan wajib diisi' }, { status: 400 });
    }

    const currentWishes = getStoredWishes();
    const updatedWishes = currentWishes.filter(item => item.id !== id);

    saveWishes(updatedWishes);
    return NextResponse.json({ success: true, wishes: updatedWishes });
  } catch (err) {
    console.error('API Wishes DELETE Error:', err);
    return NextResponse.json({ error: 'Gagal menghapus ucapan' }, { status: 500 });
  }
}
