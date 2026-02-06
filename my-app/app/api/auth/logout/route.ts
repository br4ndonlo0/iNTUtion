import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Delete the cookie by setting it to expire immediately
  response.cookies.set("user", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  return response;
}