// src/lib/firebase.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, adminStorage, serverTimestamp } from '@/lib/firebaseAdmin';

export async function uploadStoryImage(file: File, uid: string): Promise<string> {
  try {
    const storage = getStorage();
    const fileExtension = file.name.split('.').pop();
    const fileName = `stories/${uid}/${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    // Set proper metadata and security rules
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uid: uid,
        uploadedAt: new Date().toISOString()
      }
    };
    
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
}