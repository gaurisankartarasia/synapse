/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { db, FieldValue } from "../../src/lib/firebaseAdmin";

// Firestore trigger to move stories to archive after a set period
export const moveStoryToArchive = onDocumentCreated(
  "user_stories/{userId}/stories/{storyId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const storyData = snap.data();
    const { userId, storyId } = event.params;

    if (!storyData) return;

    // Delay execution (e.g., move after 24 days)
    const archiveDelay =  24 * 60 * 60 * 1000; 

    setTimeout(async () => {
      try {
        // Move to the archive collection
        await db.collection("archived_stories").doc(storyId).set({
          ...storyData,
          archivedAt: FieldValue.serverTimestamp(),
          userId, // Keep track of original owner
        });

        // Delete from the original location
        await db
          .collection("user_stories")
          .doc(userId)
          .collection("stories")
          .doc(storyId)
          .delete();

        console.log(`Story ${storyId} moved to archive.`);
      } catch (error) {
        console.error("Error moving story to archive:", error);
      }
    }, archiveDelay);

    return;
  }
);
