// src/app/api/admin/store/upload/route.ts

import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin"; 
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Correctly assert as File | null
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // --- Optional Server-Side Validation ---
    // Example: Check file type (adjust mimetypes as needed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` }, { status: 400 });
    }
    // Example: Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
         return NextResponse.json({ error: `File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max size: ${maxSize / 1024 / 1024} MB` }, { status: 400 });
    }
    // --- End Validation ---

    const buffer = Buffer.from(await file.arrayBuffer());

    // Use the file.name property safely now
    const uniqueFileName = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`; // Replace spaces for safety
    const storagePath = `products/${uniqueFileName}`;

    const bucket = adminStorage.bucket(); // Ensure default bucket is configured
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        // You could add custom metadata like original filename if needed
        // metadata: { originalName: file.name }
      },
    });

    // Consider using getPublicUrl if the bucket/files are public by default
    // const imageUrl = fileRef.publicUrl();
    // OR keep signed URL for controlled access
    const [imageUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Far future date (adjust as needed for your security policy)
    });

    console.log("Image uploaded:", imageUrl);
    return NextResponse.json({ imageUrl }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: `Upload failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}