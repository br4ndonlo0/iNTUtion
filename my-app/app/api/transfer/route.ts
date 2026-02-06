import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { decryptBalance, encryptBalance } from "@/lib/encryption";

type TransferPayload = {
  senderId?: string;
  recipientId?: string;
  amount?: number;
};

class TransferError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function POST(request: Request) {
  let session: import("mongodb").ClientSession | undefined;

  try {
    const body = (await request.json()) as TransferPayload;
    const senderIdRaw = body.senderId?.trim();
    const recipientIdRaw = body.recipientId?.trim();
    const amount = body.amount;

    if (!senderIdRaw || !recipientIdRaw || amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, message: "senderId, recipientId, and amount are required." },
        { status: 400 },
      );
    }

    if (senderIdRaw === recipientIdRaw) {
      return NextResponse.json(
        { success: false, message: "Cannot transfer to the same account." },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be a valid number greater than 0." },
        { status: 400 },
      );
    }

    // currency-safe rounding to cents
    const amountCents = Math.round(amount * 100);
    if (amountCents <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0." },
        { status: 400 },
      );
    }

    let senderId: ObjectId;
    let recipientId: ObjectId;
    try {
      senderId = new ObjectId(senderIdRaw);
      recipientId = new ObjectId(recipientIdRaw);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid senderId or recipientId." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    session = client.startSession();

    const db = client.db();
    const users = db.collection("users");
    const transactions = db.collection("transactions");

    const runTransfer = async () => {
      const sender = await users.findOne({ _id: senderId }, { session });
      const recipient = await users.findOne({ _id: recipientId }, { session });

      if (!sender) {
        return { ok: false as const, status: 404, message: "Sender not found." };
      }
      if (!recipient) {
        return { ok: false as const, status: 404, message: "Recipient not found." };
      }

      const senderBalance = sender.balance ? decryptBalance(sender.balance) : 0;
      const recipientBalance = recipient.balance ? decryptBalance(recipient.balance) : 0;

      const senderCents = Math.round(senderBalance * 100);
      const recipientCents = Math.round(recipientBalance * 100);

      if (senderCents < amountCents) {
        return { ok: false as const, status: 400, message: "Insufficient funds." };
      }

      const newSenderBalance = (senderCents - amountCents) / 100;
      const newRecipientBalance = (recipientCents + amountCents) / 100;

      const senderEncrypted = encryptBalance(newSenderBalance);
      const recipientEncrypted = encryptBalance(newRecipientBalance);

      await users.updateOne(
        { _id: senderId },
        { $set: { balance: senderEncrypted, updatedAt: new Date() } },
        { session },
      );

      await users.updateOne(
        { _id: recipientId },
        { $set: { balance: recipientEncrypted, updatedAt: new Date() } },
        { session },
      );

      // Create transaction record
      await transactions.insertOne(
        {
          senderId,
          recipientId,
          amount: amountCents / 100,
          status: "completed",
          createdAt: new Date(),
        },
        { session },
      );

      return {
        ok: true as const,
        newSenderBalance,
        newRecipientBalance,
      };
    };

    // Prefer a transaction (atomic) when available; fallback if not supported.
    try {
      const okResult = await session.withTransaction(async () => {
        const result = await runTransfer();
        if (!result.ok) {
          throw new TransferError(result.status, result.message);
        }
        return result;
      });

      if (!okResult) {
        return NextResponse.json(
          { success: false, message: "Transfer failed." },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          sender: { id: senderIdRaw, balance: okResult.newSenderBalance },
          recipient: { id: recipientIdRaw, balance: okResult.newRecipientBalance },
        },
        { status: 200 },
      );
    } catch (err) {
      if (err instanceof TransferError) {
        return NextResponse.json(
          { success: false, message: err.message },
          { status: err.status },
        );
      }

      // Transaction not available (e.g., standalone MongoDB) — do best-effort transfer.
      const result = await runTransfer();
      if (!result.ok) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        {
          success: true,
          sender: { id: senderIdRaw, balance: result.newSenderBalance },
          recipient: { id: recipientIdRaw, balance: result.newRecipientBalance },
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to transfer funds." },
      { status: 500 },
    );
  } finally {
    try {
      await session?.endSession();
    } catch {
      // ignore
    }
  }
}
