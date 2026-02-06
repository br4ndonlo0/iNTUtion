import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    officialName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, default: "DBS" },
    nicknames: [{ type: String }],
    relationship: { type: String },
    photoUrl: { type: String },
    phoneNumber: { type: String }, // Added this since your DB has it
  },
  {
    // 👇 CRITICAL FIX: Force Mongoose to use your existing collection
    collection: "recepients",
  },
);

export default mongoose.models.Recipient ||
  mongoose.model("Recipient", RecipientSchema);
