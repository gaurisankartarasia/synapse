// app/api/user/privacy/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const userRef = db.collection('users').doc(payload.uid);
    const userDoc = await userRef.get();
    
    return NextResponse.json({
      status: userDoc.data()?.isPrivate || false
    });
    
  } catch (error) {
    console.error("Error fetching privacy status:", error);
    return NextResponse.json(
      { error: "Failed to fetch privacy status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { isPrivate } = await request.json();
    const userRef = db.collection('users').doc(payload.uid);
    
    await userRef.set({ isPrivate }, { merge: true });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error updating privacy status:", error);
    return NextResponse.json(
      { error: "Failed to update privacy status" },
      { status: 500 }
    );
  }
}