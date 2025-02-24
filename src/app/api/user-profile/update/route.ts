import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { db } from "@/lib/firebaseAdmin";

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token?.value) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    if (!decodedToken.uid) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { displayName, username, bio, profilePhotoURL } = body;
    if (!displayName || !username) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const userRef = db.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const userData = userDoc.data();
    const updates: any = { displayName, bio: bio || '', profilePhotoURL };

    // Handle username update constraints
    if (username !== userData?.username) {
      const now = new Date();
      const lastUpdated = userData?.usernameLastUpdated?.toDate();
      const editCount = userData?.usernameEditCount || 0;
      const daysSinceLast = lastUpdated ? (now.getTime() - lastUpdated.getTime()) / (86400000) : 16;

      if (daysSinceLast > 15) {
        updates.username = username;
        updates.usernameEditCount = 1;
        updates.usernameLastUpdated = now;
      } else if (editCount >= 2) {
        return NextResponse.json({ error: 'Username can only be changed twice every 15 days' }, { status: 400 });
      } else {
        updates.username = username;
        updates.usernameEditCount = editCount + 1;
        updates.usernameLastUpdated = now;
      }
    }

    await userRef.update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}