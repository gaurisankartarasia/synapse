// src/app/api/user-profile/can-edit/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

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

    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();

    const lastEdit = userData?.lastEditedAt?.toDate() || new Date(0);
    const daysSinceLastEdit = (new Date().getTime() - lastEdit.getTime()) / (1000 * 60 * 60 * 24);
    const editCount = userData?.editCount || 0;

    const canEdit = daysSinceLastEdit >= 15 || editCount < 2;

    return NextResponse.json({ canEdit });
  } catch (error) {
    console.error("Error checking edit status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}