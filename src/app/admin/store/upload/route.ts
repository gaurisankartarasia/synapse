import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin"; // Use Admin SDK for upload
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // Convert Blob to Buffer
    const fileName = `products/${uuidv4()}`;
    const bucket = adminStorage.bucket();

    const fileRef = bucket.file(fileName);
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    const [imageUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "01-01-2030",
    });

    return NextResponse.json({ imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
