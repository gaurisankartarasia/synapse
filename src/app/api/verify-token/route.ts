// src/app/api/verify-token/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return NextResponse.json({ status: "success", decodedToken });
  } catch (error) {
    return NextResponse.json({ status: "error", error: "Invalid token" });
  }
}
