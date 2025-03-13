// // src/app/api/stories/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// export async function GET(request: NextRequest) {
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

//     // Fetch all stories
//     const storiesSnapshot = await db.collection('user_stories')
//       .doc(payload.uid)
//       .collection('stories')
//       .orderBy('createdAt', 'desc')
//       .get();

//     const stories = storiesSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         ...data,
//         createdAt: data.createdAt?.toDate?.() || null,
//         updatedAt: data.updatedAt?.toDate?.() || null,
//       };
//     });

//     return NextResponse.json({ stories });

//   } catch (error) {
//     console.error('Fetch stories error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/stories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function GET(request: NextRequest) {
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

    // Get list of users the current user follows
    const followingSnapshot = await db.collection('users')
      .doc(payload.uid)
      .collection('following')
      .get();

    const followingIds = [payload.uid, ...followingSnapshot.docs.map(doc => doc.id)];

    // Fetch all stories from followed users and own stories
    const storiesPromises = followingIds.map(async (userId) => {
      const userStoriesSnapshot = await db.collection('user_stories')
        .doc(userId)
        .collection('stories')
        .orderBy('createdAt', 'desc')
        .get();

      // Get user data for each story
      if (!userStoriesSnapshot.empty) {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();

        return userStoriesSnapshot.docs.map(doc => {
          const storyData = doc.data();
          return {
            ...storyData,
            createdAt: storyData.createdAt?.toDate?.() || null,
            updatedAt: storyData.updatedAt?.toDate?.() || null,
            userId,
            username: userData?.username || '',
            profilePhotoURL: userData?.profilePhotoURL || '',
          };
        });
      }
      return [];
    });

    const allStories = await Promise.all(storiesPromises);
    const stories = allStories
      .flat()
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

    return NextResponse.json({ stories });

  } catch (error) {
    console.error('Fetch stories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
