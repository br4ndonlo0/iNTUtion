import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { decryptBalance } from "@/lib/encryption";
import { SignJWT } from "jose";

type LoginPayload = {
  identifier?: string;
  username?: string;
  phone?: string;
  password?: string;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change"
);

const normalizePhone = (value: string) => value.replace(/(?!^\+)[^\d]/g, "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const identifier = body.identifier?.trim() || body.username?.trim() || body.phone?.trim();
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Username or phone and password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const identifierLower = identifier.toLowerCase();
    const phoneNormalized = normalizePhone(identifier);

    const orConditions: Record<string, string>[] = [{ usernameLower: identifierLower }];
    if (phoneNormalized) {
      orConditions.push({ phoneNormalized });
    }

    // Find user by username or phone
    const user = await users.findOne({ $or: orConditions });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username/phone or password." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid username/phone or password." },
        { status: 401 }
      );
    }

    // Create the Token
    const token = await new SignJWT({ 
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h") // Session lasts 1 day
      .sign(JWT_SECRET);

    // Return success with user info (excluding password)
    const decryptedBalance = user.balance ? decryptBalance(user.balance) : 0;
    
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          phoneNumber: user.phoneNumber ?? null,
          balance: decryptedBalance,
          preferredLanguage: user.preferredLanguage || "en",
        },
      },
      { status: 200 }
    );

    response.cookies.set("user", token, {
      httpOnly: true, // Prevents JavaScript from accessing it (Security)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
      sameSite: "strict", // Protects against CSRF
      path: "/", // Available across the whole app
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
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
