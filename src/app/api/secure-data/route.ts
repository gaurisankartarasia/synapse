// src/app/api/secure-data/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await auth.verifyIdToken(token);
    return NextResponse.json({ data: "Secure data" });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
