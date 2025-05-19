import { Document, Schema, Types } from "mongoose";
import { RewardDocument, RewardSchema } from "./reward.schema";

export interface EventDocument extends Document {
  _id: Types.ObjectId;
  type: "birthday" | "login" | "invite";
  title: string;
  description?: string;
  rewards: RewardDocument[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const EventSchema = new Schema<EventDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ["birthday", "login", "invite"],
    },
    title: { type: String, required: true },
    description: String,
    rewards: [RewardSchema],
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);
