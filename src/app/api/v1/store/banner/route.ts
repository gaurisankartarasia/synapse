// src/app/api/banner/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await db.collection('store').doc('banner').get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const data = snapshot.data();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 });
  }
}
