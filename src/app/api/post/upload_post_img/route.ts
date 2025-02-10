//api/post/upload_post_img
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { adminStorage } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';
import { cookies } from 'next/headers';
import sharp from 'sharp';
import { randomBytes } from 'crypto';


export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Extract image
    const image = formData.get('image') as File;

    // Validate image
    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Validate image type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedImageTypes.includes(image.type)) {
      return NextResponse.json({ 
        error: 'Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (image.size > maxSize) {
      return NextResponse.json({ 
        error: 'Image size exceeds maximum allowed size of 5MB' 
      }, { status: 400 });
    }

    // Resize and optimize the image
    const buffer = Buffer.from(await image.arrayBuffer());
    const resizedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();

    // Define Firebase Storage details
    const bucket = adminStorage.bucket();
    const filename = `uploads/posts/${payload.uid}/${Date.now()}-${image.name}`;
    const file = bucket.file(filename);

    // Generate a token for secure access
    // const storageToken = require('crypto').randomBytes(16).toString('hex');
    const storageToken = randomBytes(16).toString('hex');

    // Upload image with metadata
    await file.save(resizedBuffer, {
      metadata: {
        contentType: 'image/webp', // Since we're converting to WebP
        metadata: {
          firebaseStorageDownloadTokens: storageToken,
        },
      },
    });

    // Construct the image URL with token
    const imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      filename
    )}?alt=media&token=${storageToken}`;

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageURL 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}