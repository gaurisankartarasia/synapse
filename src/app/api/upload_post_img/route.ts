import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import { adminStorage } from '@/lib/firebaseAdmin';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyAuth(req);
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
    const filename = `uploads/posts/${user.uid}/${Date.now()}-${image.name}`;
    const file = bucket.file(filename);

    // Generate a token for secure access
    const token = require('crypto').randomBytes(16).toString('hex');

    // Upload image with metadata
    await file.save(resizedBuffer, {
      metadata: {
        contentType: 'image/webp', // Since we're converting to WebP
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    // Construct the image URL with token
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      filename
    )}?alt=media&token=${token}`;

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}