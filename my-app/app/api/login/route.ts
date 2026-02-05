import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { decryptBalance } from "@/lib/encryption";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const emailLower = email.toLowerCase();

    // Find user by email
    const user = await users.findOne({ emailLower });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Return success with user info (excluding password)
    const decryptedBalance = user.balance ? decryptBalance(user.balance) : 0;
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber ?? null,
          balance: decryptedBalance,
          preferredLanguage: user.preferredLanguage || "en",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to log in. Please try again.",
      },
      { status: 500 }
    );
  }
}
