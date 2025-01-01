// app/api/user/[uid]/mini/route.ts
import { db } from '@/lib/firebaseAdmin';

export async function GET(
    request: Request,
    { params }: { params: { uid: string } }
) {
    try {
        const userRef = db.collection('users').doc(params.uid);
        const userSnap = await userRef.get();
      
        if (!userSnap.exists) {
            return new Response(null, { status: 404 });
        }
  
        const { username, photoURL, displayName, verified } = userSnap.data() || {};
        return Response.json({ username, photoURL, displayName, verified });
    } catch (error) {
        return new Response(null, { status: 500 });
    }
}