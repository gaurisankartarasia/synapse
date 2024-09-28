import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("q")?.toLowerCase() || "";

    if (!searchTerm) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", ">=", searchTerm)
      .where("username", "<=", searchTerm + "\uf8ff")
      .limit(20)
      .get();

    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      username: doc.data().username,
      displayName: doc.data().displayName,
      photoURL: doc.data().photoURL,
      private: doc.data().private || false,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
