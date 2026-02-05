import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { decryptBalance } from "@/lib/encryption"; // Ensure you import your decrypt helper
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(request: Request) {
  // 1. Get the cookie from the request
  // Next.js provides a helpful 'cookies' utility on the request
    const cookieStore = await cookies();
  const token = cookieStore.get("user")?.value;

  if (!token) {
    return NextResponse.json(
      { isLoggedIn: false, message: "No session token found" }, 
      { status: 401 }
    );
  }

  try {
    // 2. Verify the JWT Signature
    // If this fails (token modified or expired), it jumps to catch()
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 3. (Optional but Recommended) Get FRESH user data from DB
    // This ensures if the user was deleted/banned 5 mins ago, they can't access data.
    // It also gets the LATEST balance.
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(payload.userId as string) 
    });

    if (!user) {
      return NextResponse.json(
        { isLoggedIn: false, message: "User no longer exists" }, 
        { status: 401 }
      );
    }

    // 4. Decrypt the fresh balance
    const decryptedBalance = user.balance ? decryptBalance(user.balance) : 0;

    // 5. Return the Session Data
    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        balance: decryptedBalance, // <--- Fresh balance from DB
        preferredLanguage: user.preferredLanguage || "en",
      },
    });

  } catch (error) {
    console.error("Session verification failed:", error);
    // If token is invalid or expired, tell frontend to log out
    return NextResponse.json(
      { isLoggedIn: false, message: "Invalid token" }, 
      { status: 401 }
    );
  }
}