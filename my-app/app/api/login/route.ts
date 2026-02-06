import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

type LoginPayload = {
  identifier?: string;
  username?: string;
  phone?: string;
  password?: string;
};

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

    // Return success with user info (excluding password)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
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
