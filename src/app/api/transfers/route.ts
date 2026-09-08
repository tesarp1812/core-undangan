import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultTransfers from '@/data/transfers.json';

const filePath = path.join(process.cwd(), 'src/data/transfers.json');

export interface TransferRecord {
  id: string;
  senderName: string;
  amount?: string;
  proofDataUrl: string; // Base64 or Image URL
  notes?: string;
  status?: 'pending' | 'verified';
  createdAt: string;
}

function getStoredTransfers(): TransferRecord[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading transfers file:', err);
  }
  return defaultTransfers as TransferRecord[];
}

function saveTransfers(records: TransferRecord[]) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing transfers file:', err);
  }
}

export async function GET() {
  const records = getStoredTransfers();
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderName, amount, proofDataUrl, notes } = body;

    if (!senderName || !proofDataUrl) {
      return NextResponse.json({ error: 'Nama pengirim dan foto bukti transfer wajib diisi' }, { status: 400 });
    }

    const currentRecords = getStoredTransfers();

    const newRecord: TransferRecord = {
      id: Date.now().toString(),
      senderName: senderName.trim(),
      amount: amount ? amount.trim() : undefined,
      proofDataUrl,
      notes: notes ? notes.trim() : undefined,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newRecord, ...currentRecords];
    saveTransfers(updated);

    return NextResponse.json({ success: true, records: updated });
  } catch (err) {
    console.error('API Transfers POST Error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan bukti transfer' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID transfer wajib diisi' }, { status: 400 });
    }

    const currentRecords = getStoredTransfers();
    const updated = currentRecords.map(item => {
      if (item.id === id) {
        return { ...item, status: status || (item.status === 'verified' ? 'pending' : 'verified') as 'pending' | 'verified' };
      }
      return item;
    });

    saveTransfers(updated);
    return NextResponse.json({ success: true, records: updated });
  } catch (err) {
    console.error('API Transfers PATCH Error:', err);
    return NextResponse.json({ error: 'Gagal memperbarui status transfer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID transfer wajib diisi' }, { status: 400 });
    }

    const currentRecords = getStoredTransfers();
    const updated = currentRecords.filter(item => item.id !== id);

    saveTransfers(updated);
    return NextResponse.json({ success: true, records: updated });
  } catch (err) {
    console.error('API Transfers DELETE Error:', err);
    return NextResponse.json({ error: 'Gagal menghapus bukti transfer' }, { status: 500 });
  }
}
