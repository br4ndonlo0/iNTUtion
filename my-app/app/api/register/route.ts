import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { encryptBalance } from "@/lib/encryption";

type RegisterPayload = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phoneNumberRaw = body.phoneNumber?.trim();
    const password = body.password;

    if (!name || !email || !phoneNumberRaw || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 },
      );
    }

    const phoneNumber = phoneNumberRaw.replace(/\D/g, "");
    if (phoneNumber.length !== 8) {
      return NextResponse.json(
        { success: false, message: "Phone number must be exactly 8 digits." },
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

    const existingUser = await users.findOne({ emailLower });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const initialBalance = 1000; // Starting balance for new users
    const encryptedBalance = encryptBalance(initialBalance);

    await users.insertOne({
      name,
      email,
      emailLower,
      phoneNumber,
      passwordHash,
      balance: encryptedBalance,
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
