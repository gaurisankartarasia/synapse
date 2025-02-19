
// // src/app/api/stories/upload/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import sharp from 'sharp';
// import { v4 as uuidv4 } from 'uuid';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { adminStorage, db, FieldValue } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// export async function POST(request: NextRequest) {
//   try {
//     // Verify authentication
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: 'Invalid token payload' },
//         { status: 401 }
//       );
//     }

//     // Get the form data
//     const formData = await request.formData();
//     const file = formData.get('image') as File;
//     const title = formData.get('title') as string;
//     const description = formData.get('description') as string;

//     if (!file || !title) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Validate file size
//     if (file.size > MAX_FILE_SIZE) {
//       return NextResponse.json(
//         { error: 'File too large' },
//         { status: 400 }
//       );
//     }

//     // Generate unique IDs
//     const storyId = uuidv4();
//     const filename = `${storyId}.webp`;

//     // Convert File to Buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Optimize image with Sharp
//     const optimizedBuffer = await sharp(buffer)
//       .resize(1920, 1080, {
//         fit: 'inside',
//         withoutEnlargement: true
//       })
//       .webp({ quality: 80 })
//       .toBuffer();

//     // Upload to Firebase Storage
//     const bucket = adminStorage.bucket();
//     const fileRef = bucket.file(`user_stories/${payload.uid}/${filename}`);

//     await fileRef.save(optimizedBuffer, {
//       metadata: {
//         contentType: 'image/webp',
//       },
//     });

//     // Get public URL
//     const [url] = await fileRef.getSignedUrl({
//       action: 'read',
//       expires: '03-01-2500',
//     });

//     // Save to Firestore
//     const storyData = {
//       id: storyId,
//       title,
//       description: description || '',
//       imageUrl: url,
//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp()
//     };

//     await db.collection('user_stories')
//       .doc(payload.uid)
//       .collection('stories')
//       .doc(storyId)
//       .set(storyData);

//     return NextResponse.json({ storyId });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }










// src/app/api/stories/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { adminStorage, db, FieldValue } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
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

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Create a Firestore document reference (Firestore generates the ID)
    const storyRef = db.collection('user_stories')
      .doc(payload.uid)
      .collection('stories')
      .doc();

    const storyId = storyRef.id; // Get auto-generated ID
    const filename = `${storyId}.webp`;

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimize image with Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(`user_stories/${payload.uid}/${filename}`);

    await fileRef.save(optimizedBuffer, {
      metadata: {
        contentType: 'image/webp',
      },
    });

    // Get public URL
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    // Save to Firestore
    const storyData = {
      id: storyId,
      title,
      description: description || '',
      imageUrl: url,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    await storyRef.set(storyData);

    return NextResponse.json({ storyId });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
