import { Document, Schema } from "mongoose";
import { RewardDocument, RewardSchema } from "./reward.schema";

interface EventDocument extends Document {
  type: "birthday" | "login" | "invite";
  title: string;
  description?: string;
  rewards: RewardDocument[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const EventSchema = new Schema<EventDocument>({
  type: {
    type: String,
    required: true,
    enum: ["birthday", "login", "invite"],
  },
  title: { type: String, required: true },
  description: String,
  rewards: [RewardSchema],
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
