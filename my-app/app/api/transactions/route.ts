import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("user")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get limit from query params (default 10)
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const client = await clientPromise;
    const db = client.db();
    const transactions = db.collection("transactions");

    // Find transactions where user is either sender or recipient
    const userObjectId = new ObjectId(userId);
    const recentTransactions = await transactions
      .find({
        $or: [
          { senderId: userObjectId },
          { recipientId: userObjectId }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Get user names for sender and recipient
    const users = db.collection("users");
    const transactionsWithNames = await Promise.all(
      recentTransactions.map(async (txn) => {
        const sender = await users.findOne({ _id: txn.senderId });
        const recipient = await users.findOne({ _id: txn.recipientId });

        return {
          id: txn._id.toString(),
          amount: txn.amount,
          type: txn.senderId.equals(userObjectId) ? "sent" : "received",
          senderName: sender?.name || "Unknown",
          recipientName: recipient?.name || "Unknown",
          senderId: txn.senderId.toString(),
          recipientId: txn.recipientId.toString(),
          createdAt: txn.createdAt,
          status: txn.status || "completed"
        };
      })
    );

    return NextResponse.json({
      success: true,
      transactions: transactionsWithNames
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
