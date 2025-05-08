// // src/app/api/admin/store/upload/route.ts

// import { NextResponse } from "next/server";
// import { adminStorage } from "@/lib/firebaseAdmin"; 
// import { v4 as uuidv4 } from "uuid";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     // Correctly assert as File | null
//     const file = formData.get("file") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // --- Optional Server-Side Validation ---
//     // Example: Check file type (adjust mimetypes as needed)
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
//     if (!allowedTypes.includes(file.type)) {
//         return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` }, { status: 400 });
//     }
//     // Example: Check file size (e.g., max 5MB)
//     const maxSize = 5 * 1024 * 1024; // 5 MB
//     if (file.size > maxSize) {
//          return NextResponse.json({ error: `File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max size: ${maxSize / 1024 / 1024} MB` }, { status: 400 });
//     }
//     // --- End Validation ---

//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Use the file.name property safely now
//     const uniqueFileName = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`; // Replace spaces for safety
//     const storagePath = `products/${uniqueFileName}`;

//     const bucket = adminStorage.bucket(); // Ensure default bucket is configured
//     const fileRef = bucket.file(storagePath);

//     await fileRef.save(buffer, {
//       metadata: {
//         contentType: file.type,
//         // You could add custom metadata like original filename if needed
//         // metadata: { originalName: file.name }
//       },
//     });

//     // Consider using getPublicUrl if the bucket/files are public by default
//     // const imageUrl = fileRef.publicUrl();
//     // OR keep signed URL for controlled access
//     const [imageUrl] = await fileRef.getSignedUrl({
//       action: "read",
//       expires: "03-09-2491", // Far future date (adjust as needed for your security policy)
//     });

//     console.log("Image uploaded:", imageUrl);
//     return NextResponse.json({ imageUrl }, { status: 201 });

//   } catch (error: any) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: `Upload failed: ${error.message || 'Unknown error'}` }, { status: 500 });
//   }
// }




// src/app/api/admin/store/upload/route.ts

import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin"; 
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

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

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Optimize the image with Sharp
    let processedBuffer: Buffer;
    let outputFormat = file.type;
    
    // Determine best processing based on image type
    switch (file.type) {
      case 'image/jpeg':
        processedBuffer = await sharp(buffer)
          .jpeg({ quality: 80, mozjpeg: true }) // mozjpeg for better compression
          .toBuffer();
        break;
      case 'image/png':
        // For PNG, convert to WebP unless transparency is needed
        processedBuffer = await sharp(buffer)
          .webp({ quality: 80, lossless: false })
          .toBuffer();
        outputFormat = 'image/webp';
        break;
      case 'image/webp':
        processedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
        break;
      case 'image/gif':
        // GIFs are tricky - keep as is to maintain animation
        processedBuffer = buffer;
        break;
      default:
        // Fallback for other formats
        processedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
        outputFormat = 'image/webp';
    }

    // Calculate compression savings
    const compressionRatio = (buffer.length / processedBuffer.length).toFixed(1);
    console.log(`Image compressed: ${buffer.length} → ${processedBuffer.length} bytes (${compressionRatio}x smaller)`);

    // Update file extension if format changed
    const originalExt = file.name.split('.').pop() || '';
    const newExt = outputFormat.split('/').pop() || originalExt;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const uniqueFileName = `${uuidv4()}-${baseName.replace(/\s+/g, '_')}.${newExt}`;
    
    const storagePath = `products/${uniqueFileName}`;

    const bucket = adminStorage.bucket(); // Ensure default bucket is configured
    const fileRef = bucket.file(storagePath);

    await fileRef.save(processedBuffer, {
      metadata: {
        contentType: outputFormat,
        metadata: { 
          originalName: file.name,
          originalSize: buffer.length,
          compressedSize: processedBuffer.length,
          compressionRatio: compressionRatio
        }
      },
    });

    // Get signed URL for the uploaded file
    const [imageUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Far future date
    });

    console.log("Optimized image uploaded:", imageUrl);
    return NextResponse.json({ 
      imageUrl,
      originalSize: buffer.length,
      compressedSize: processedBuffer.length,
      compressionRatio
    }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: `Upload failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}