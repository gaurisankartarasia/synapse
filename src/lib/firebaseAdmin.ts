//src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";
import { getApps, getApp } from "firebase-admin/app";
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import {serverTimestamp} from 'firebase/firestore'

// Initialize Firebase Admin SDK using environment variables
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const app = getApp();
const auth = admin.auth(app);
const db = admin.firestore(app);
const adminStorage = admin.storage(app);

export { admin, auth, db, adminStorage, FieldValue, serverTimestamp, Timestamp };
