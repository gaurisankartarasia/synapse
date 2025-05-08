
// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const id = url.pathname.split("/").pop();

//   if (!id) {
//     return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
//   }

//   try {
//     const productDoc = await db.collection("products").doc(id).get();

//     if (!productDoc.exists) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     const productData = productDoc.data();
//     let isWishlisted = false;
//     let uid: string | undefined;

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (token) {
//       try {
//         const decoded = await verifyJWT(token);
//         uid = decoded?.uid;

//         if (uid) {
//           const wishlistDoc = await db.doc(`users/${uid}/storeWishlist/${id}`).get();
//           isWishlisted = wishlistDoc.exists;
//         }
//       } catch (error) {
//         console.error("Error verifying JWT:", error);
//         isWishlisted = false;
//         uid = undefined; // Ensure uid is undefined if verification fails
//       }
//     }

//     return NextResponse.json({
//       id: productDoc.id,
//       ...productData,
//       isWishlisted,
//       viewer: {
//         uid: uid,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = productDoc.data();
    let isWishlisted = false;
    let isInCart = false;
    let uid: string | undefined;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = await verifyJWT(token);
        uid = decoded?.uid;

        if (uid) {
          const [wishlistDoc, cartDoc] = await Promise.all([
            db.doc(`users/${uid}/storeWishlist/${id}`).get(),
            db.doc(`users/${uid}/storeCart/${id}`).get(),
          ]);

          isWishlisted = wishlistDoc.exists;
          isInCart = cartDoc.exists;
        }
      } catch (error) {
        console.error("JWT verification failed:", error);
      }
    }

    return NextResponse.json({
      id: productDoc.id,
      ...productData,
      isWishlisted,
      isInCart,
      viewer: {
        uid,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
