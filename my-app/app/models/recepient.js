import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema({
  // Link this contact to the logged-in user (so I don't see your contacts)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // The official bank details (Backend needs this)
  officialName: { type: String, required: true }, // e.g., "Tan Wei Ming"
  accountNumber: { type: String, required: true },
  bankName: { type: String, default: "DBS" },

  // The "Voice Triggers" (AI needs this)
  // We use an array so "Ah Boy", "Grandson", and "Wei Ming" all work
  nicknames: [{ type: String }],

  // The "Visual Confirmation" (User needs this)
  relationship: { type: String }, // e.g., "Grandson"
  photoUrl: { type: String }, // URL to an image
});

// Prevent model overwrite error in Next.js
export default mongoose.models.Recipient ||
  mongoose.model("Recipient", RecipientSchema);
