

// import { NextApiRequest, NextApiResponse } from 'next';
// import { db, auth } from '../../lib/firebaseAdmin'; // Make sure firebaseAdmin is correctly set up

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {  // Ensure GET method is allowed
//     try {
//       const authHeader = req.headers.authorization;

//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
//       }

//       const token = authHeader.split(' ')[1];

//       // Verify the token using Firebase Admin SDK
//       const decodedToken = await auth.verifyIdToken(token);
//       if (!decodedToken) {
//         return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//       }

//       // Fetch users from Firestore
//       const usersSnapshot = await db.collection('users').get();
//       const users = usersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       return res.status(200).json({ users });
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     // Return 405 if method is not GET
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }









import { NextApiRequest, NextApiResponse } from 'next';
import { db, auth } from '../../lib/firebaseAdmin'; // Ensure firebaseAdmin is correctly set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {  // Ensure GET method is allowed
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }

      const token = authHeader.split(' ')[1];

      // Verify the token using Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(token);
      if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      // Fetch users from Firestore
      const usersSnapshot = await db.collection('users').get();
      const users = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          photoURL: data.photoURL || null,  // Include profile picture
          username: data.username || null,     // Include username
          displayName: data.displayName || null, // Include display name
          verified: data.verified || false,    // Include verified status
        };
      });

      return res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Return 405 if method is not GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
