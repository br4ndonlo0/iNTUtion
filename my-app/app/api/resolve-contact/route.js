import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 1. Define Schema INLINE to ensure we hit the exact collection from your screenshot
// We force the collection name to 'recepients' to match your DB
const RecipientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    officialName: String,
    nicknames: [String],
    phoneNumber: String,
    bankName: String,
    accountNumber: String,
    relationship: String,
    photoUrl: String,
  },
  { collection: "recepients" },
); // <--- CRITICAL: Matches your DB screenshot spelling

// Get or Create the Model
const Recipient =
  mongoose.models.Recipient || mongoose.model("Recipient", RecipientSchema);

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req) {
  try {
    await connectDB();
    const { spokenName, userId } = await req.json();

    const cleanName = spokenName.trim();

    console.log(`[API] 🔍 Search: "${cleanName}" | User: ${userId}`);

    // 2. FORCE OBJECTID CONVERSION
    // We must convert the string ID from the session to a real MongoDB ObjectId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (e) {
      console.error("Invalid User ID format");
      return NextResponse.json({ found: false });
    }

    // 3. SEARCH
    const contact = await Recipient.findOne({
      userId: userObjectId, // <--- Using the ObjectId, not string
      nicknames: { $regex: new RegExp(`^${cleanName}$`, "i") },
    });

    if (!contact) {
      console.log(`[API] ❌ No match in collection 'recepients'.`);
      return NextResponse.json({
        found: false,
        message: `No contact found for "${cleanName}"`,
      });
    }

    console.log(`[API] ✅ Found: ${contact.officialName}`);

    return NextResponse.json({
      found: true,
      data: {
        name: contact.officialName,
        phoneNumber: contact.phoneNumber,
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
