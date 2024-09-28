// pages/api/start-chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../lib/firebaseAdmin"; // Firebase admin setup for server-side

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const { targetUsername } = req.body;

    // Get the target user details from the database
    const targetUser = await getUserByUsername(targetUsername); // Replace with your actual function
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create or retrieve an existing chat between the two users
    const chatId = await createOrFetchChat(decodedToken.uid, targetUser.uid);

    return res.status(200).json({ chatId });
  } catch (error) {
    console.error("Error starting chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to create/retrieve chat (pseudo-code)
async function createOrFetchChat(userId: string, targetUserId: string) {
  // Look for an existing chat between these two users in your DB
  // If none exists, create a new one and return the chat ID
  // Placeholder logic:
  const existingChat = await findChatBetweenUsers(userId, targetUserId);
  if (existingChat) {
    return existingChat.id;
  }

  const newChat = await createNewChat(userId, targetUserId);
  return newChat.id;
}
