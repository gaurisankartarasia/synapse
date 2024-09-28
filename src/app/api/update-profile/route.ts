import { NextResponse } from "next/server";
import { auth, db, adminStorage } from "../../../lib/firebaseAdmin";
import * as admin from "firebase-admin";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const { token, displayName, username, bio, profileImage } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Reference to the user document in Firestore
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data() || {};
    const currentUsername = userData.username;

    // Track changes to username updates
    const changes = userData.changes || 0;
    const lastChange = userData.lastChange ? new Date(userData.lastChange) : new Date();

    const now = new Date();
    const timeSinceLastChange = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)); // days

    if (username && username !== currentUsername) {
      if (changes >= 2 && timeSinceLastChange < 15) {
        return NextResponse.json({ error: "Username can only be updated twice every 15 days" }, { status: 400 });
      }

      // Check if the new username is already taken
      const usernameRef = db.collection("usernames").doc(username);
      const usernameDoc = await usernameRef.get();

      if (usernameDoc.exists) {
        return NextResponse.json({ error: "Username is taken" }, { status: 409 });
      }

      // Update the username
      await usernameRef.set({ uid });
      await db.collection("usernames").doc(currentUsername).delete(); // Remove old username
      await userRef.update({ username, changes: admin.firestore.FieldValue.increment(1), lastChange: now.toISOString() });
    }

    // Update the other fields
    const updateData: Record<string, any> = { displayName, bio };

    // Handle profile image update
    if (profileImage) {
      const imageBuffer = Buffer.from(profileImage, "base64");

      // Compress the image using sharp
      const compressedImage = await sharp(imageBuffer)
        .resize({ width: 500 }) // Resize to max width of 500px
        .jpeg({ quality: 80 }) // Compress image to 80% quality
        .toBuffer();

      // Store the image in Firebase Storage
      const bucket = adminStorage.bucket();
      const timestamp = Date.now();
      const fileName = `profileImages/${uid}_${timestamp}.jpg`; 
      const file = bucket.file(fileName);

      await file.save(compressedImage, {
        contentType: "image/jpeg",
        public: true, // Make the file publicly accessible
      });

      // Get the public URL of the stored image
      const publicUrl = file.publicUrl();
      updateData.photoURL = publicUrl;
    }

    // Apply the updates to the user document
    await userRef.update(updateData);

    return NextResponse.json({ status: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
