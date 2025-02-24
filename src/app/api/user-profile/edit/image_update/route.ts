// src/app/api/user-profile/upload-photo/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db, adminStorage } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Firebase Storage
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `profile-photos/${decodedToken.uid}-${timestamp}.webp`;

    // Upload to Firebase Storage
    const bucket = adminStorage.bucket(); // Make sure you've configured your bucket name
    const file = bucket.file(filename);
    
    // Upload with content type and metadata
    await file.save(buffer, {
      metadata: {
        contentType: 'image/webp',
        metadata: {
          originalName: image.name,
          uploadedBy: decodedToken.uid,
          timestamp: timestamp
        }
      }
    });

    // Get the public URL
    await file.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // Return the URL
    return NextResponse.json({ url });

  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

// Increase payload size limit for image uploads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
    responseLimit: '10mb',
  },
};