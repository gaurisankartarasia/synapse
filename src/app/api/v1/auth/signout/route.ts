// src/app/api/v1/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}



