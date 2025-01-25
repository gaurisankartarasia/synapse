// // src/lib/jwt.ts
// import * as jose from 'jose';

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET 
// );

// export async function createJWT(payload: any) {
//   return await new jose.SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setExpirationTime('24h')
//     .sign(JWT_SECRET);
// }

// export async function verifyJWT(token: string) {
//   try {
//     const { payload } = await jose.jwtVerify(token, JWT_SECRET);
//     return payload;
//   } catch (error) {
//     throw new Error('Invalid token');
//   }
// }



// Update the JWT verification function in src/lib/jwt.ts
import * as jose from 'jose';
import { CustomJWTPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET 
);

export async function createJWT(payload: Partial<CustomJWTPayload>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<CustomJWTPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as CustomJWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}