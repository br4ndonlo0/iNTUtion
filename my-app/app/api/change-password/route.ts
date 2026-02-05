import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type ChangePasswordPayload = {
  userId?: string;
  oldPassword?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChangePasswordPayload;
    const userId = body.userId?.trim();
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Find user by ID
    let user;
    try {
      user = await users.findOne({ _id: new ObjectId(userId) });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid user ID." },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Hash new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          passwordHash: newPasswordHash,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json(
      { success: true, message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to change password. Please try again.",
      },
      { status: 500 }
    );
  }
}
