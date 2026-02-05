import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Recipient from "@/models/Recipient";

// Quick DB connection helper
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req) {
  try {
    await connectDB();

    // We expect the frontend to send the 'spokenName' and the current 'userId'
    const { spokenName, userId } = await req.json();

    if (!spokenName || !userId) {
      return NextResponse.json({ found: false, message: "Missing data" });
    }

    // 🔍 THE SEARCH LOGIC
    // We look for a contact belonging to THIS user where the 'nicknames' array
    // contains the spoken word (Case Insensitive Regex)
    const contact = await Recipient.findOne({
      userId: userId,
      nicknames: { $regex: new RegExp(`^${spokenName}$`, "i") },
    });

    if (!contact) {
      return NextResponse.json({
        found: false,
        message: `No contact found for "${spokenName}"`,
      });
    }

    // ✅ FOUND! Return the safe public details
    return NextResponse.json({
      found: true,
      data: {
        name: contact.officialName,
        account: contact.accountNumber,
        bank: contact.bankName,
        relationship: contact.relationship,
        photo: contact.photoUrl,
      },
    });
  } catch (error) {
    console.error("Resolve Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
