
// // app/api/user/[uid]/mini/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// // Define the correct segment configuration
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// export async function GET(
//     request: Request,
//     { params }: { params: { uid: string } }
// ) {
//     try {
//         // Validate params
//         if (!params.uid) {
//             return NextResponse.json(
//                 { error: 'User ID is required' },
//                 { status: 400 }
//             );
//         }

//         // Get token from cookies
//         const cookieStore = await cookies();
//         const token = cookieStore.get('token');

//         if (!token?.value) {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401 }
//             );
//         }

//         // Verify token and type assert the payload
//         const payload = await verifyJWT(token.value) as CustomJWTPayload;
        
//         if (!payload.uid) {
//             return NextResponse.json(
//                 { error: 'Invalid token payload' },
//                 { status: 401 }
//             );
//         }

//         // Fetch user data
//         const userRef = db.collection('users').doc(params.uid);
//         const userSnap = await userRef.get();
      
//         if (!userSnap.exists) {
//             return NextResponse.json(
//                 { error: 'User not found' },
//                 { status: 404 }
//             );
//         }
  
//         const userData = userSnap.data();
        
//         if (!userData) {
//             return NextResponse.json(
//                 { error: 'User data is empty' },
//                 { status: 404 }
//             );
//         }

//         // Return only the required fields
//         return NextResponse.json({
//             username: userData.username || null,
//             profilePhotoURL: userData.profilePhotoURL || null,
//             displayName: userData.displayName || null,
//             verified: userData.verified || false
//         });
        
//     } catch (error) {
//         console.error('User mini fetch error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }







import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

// Define the correct segment configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: Request,
    context: { params: Promise<{ uid: string }> }
) {
    try {
        // Await the params promise
        const { uid } = await context.params;

        if (!uid) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

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

        // Fetch user data
        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();
      
        if (!userSnap.exists) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
  
        const userData = userSnap.data();
        
        if (!userData) {
            return NextResponse.json(
                { error: 'User data is empty' },
                { status: 404 }
            );
        }

        // Return only the required fields
        return NextResponse.json({
            username: userData.username || null,
            profilePhotoURL: userData.profilePhotoURL || "/profile-default-photo.svg",
            displayName: userData.displayName || null,
            verified: userData.isVerified || false
        });
        
    } catch (error) {
        console.error('User mini fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
