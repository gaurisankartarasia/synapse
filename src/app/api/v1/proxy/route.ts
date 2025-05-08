import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const imageURL = request.nextUrl.searchParams.get("url");
  if (!imageURL) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(imageURL);
    const contentType = response.headers.get("content-type");

    return new NextResponse(response.body, {
      headers: { "Content-Type": contentType || "image/jpeg" },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}



