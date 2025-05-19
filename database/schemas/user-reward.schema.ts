import { Schema, Document, Types } from "mongoose";

export interface UserRewardDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  rewardId: Types.ObjectId;
  eventId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  claimedAt?: Date;
  canceledAt?: Date;
  status: "claimed" | "canceled" | "pending";
}

export const UserRewardSchema = new Schema<UserRewardDocument>(
  {
    userId: Types.ObjectId,
    rewardId: Types.ObjectId,
    eventId: Types.ObjectId,
    claimedAt: { type: Date, required: false },
    canceledAt: { type: Date, required: false },
    status: {
      type: String,
      enum: ["claimed", "canceled", "pending"],
      default: "pending",
    },
  },
  { timestamps: true },
);
