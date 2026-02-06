import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { encryptBalance } from "@/lib/encryption";

type RegisterPayload = {
  name?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  preferredLanguage?: string;
};

// No longer needed: normalizePhone

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    // Remove all whitespace from username, email, phoneNumber, and password
    const name = body.name?.replace(/\s+/g, " ").trim(); // keep spaces between words for name
    const username = body.username?.replace(/\s+/g, "");
    const email = body.email?.replace(/\s+/g, "");
    const phoneNumberRaw = body.phoneNumber?.replace(/\s+/g, "");
    const password = body.password?.replace(/\s+/g, "");
    const preferredLanguage = body.preferredLanguage || "en";

    if (!name || !username || !phoneNumberRaw || !email || !password) {
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
    const usernameLower = username.toLowerCase();

    const existingUser = await users.findOne({
      $or: [
        { emailLower },
        { usernameLower },
        { phoneNumber },
      ],
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email, username, or phone number is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const initialBalance = 1000; // Starting balance for new users
    const encryptedBalance = encryptBalance(initialBalance);

    await users.insertOne({
      name,
      username,
      usernameLower,
      email,
      emailLower,
      phoneNumber,
      passwordHash,
      balance: encryptedBalance,
      preferredLanguage,
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
