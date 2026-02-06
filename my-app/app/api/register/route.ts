import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

type RegisterPayload = {
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  password?: string;
};

const normalizePhone = (value: string) => value.replace(/(?!^\+)[^\d]/g, "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const name = body.name?.trim();
    const username = body.username?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const password = body.password;

    if (!name || !username || !phone || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const emailLower = email.toLowerCase();
    const usernameLower = username.toLowerCase();
    const phoneNormalized = normalizePhone(phone);

    if (!phoneNormalized) {
      return NextResponse.json(
        { success: false, message: "Phone number is invalid." },
        { status: 400 },
      );
    }

    const existingUser = await users.findOne({
      $or: [{ emailLower }, { usernameLower }, { phoneNormalized }],
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email, username, or phone is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await users.insertOne({
      name,
      username,
      usernameLower,
      phone,
      phoneNormalized,
      email,
      emailLower,
      passwordHash,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user.",
      },
      { status: 500 },
    );
  }
}
