import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumberRaw = searchParams.get("phoneNumber")?.trim();

    if (!phoneNumberRaw) {
      return NextResponse.json(
        { success: false, message: "phoneNumber is required." },
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

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne(
      { phoneNumber },
      { projection: { name: 1, phoneNumber: 1 } },
    );

    if (!user) {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name ?? "User",
          phoneNumber: user.phoneNumber ?? phoneNumber,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search users." },
      { status: 500 },
    );
  }
}
