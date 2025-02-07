// import { NextApiRequest, NextApiResponse } from 'next';
// import jwt from 'jsonwebtoken';

// const secret = process.env.JWT_SECRET as string;



// export default function handler(req: NextApiRequest, res: NextApiResponse) {

//    // Only allow GET requests
//    if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const token = req.cookies.token; // Assuming the cookie is named 'token'

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     res.status(200).json({ user: decoded });
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }





import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET as string;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token'); 

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token.value, secret);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}