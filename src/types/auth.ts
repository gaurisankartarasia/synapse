// src/types/auth.ts
import { JWTPayload } from 'jose';

export interface CustomJWTPayload extends JWTPayload {
  uid: string;
  email: string;
}