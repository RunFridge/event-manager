import { Document, Schema, Types } from "mongoose";
import { RewardDocument, RewardSchema } from "./reward.schema";

export const VALID_EVENT_TYPES = ["birthday", "login", "invite"] as const;

export interface EventDocument extends Document {
  _id: Types.ObjectId;
  type: "birthday" | "login" | "invite";
  title: string;
  description?: string;
  rewards: RewardDocument[];
  targetCriteria: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const EventSchema = new Schema<EventDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: VALID_EVENT_TYPES,
    },
    title: { type: String, required: true },
    description: String,
    rewards: [RewardSchema],
    targetCriteria: { type: Number, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);
