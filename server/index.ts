// import express from 'express';

// const app = express();
// const PORT = 5000; // Different from Next.js (3000)

// app.use(express.json());

// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello from Express!' });
// });

// app.listen(PORT, () => {
//   console.log(`Express server running at http://localhost:${PORT}`);
// });


import express from "express";
import admin from "firebase-admin";
import cors from "cors";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();
const app = express();
const PORT = 5000;

// ✅ Fix CORS issue for Next.js (App Router)
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

// API Route to fetch users
app.get("/api/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").limit(10).get();
    const users = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});
