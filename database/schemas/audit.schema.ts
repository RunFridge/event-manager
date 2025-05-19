import { Schema, Document, Types } from "mongoose";
import { RewardDocument, RewardSchema } from "./reward.schema";

export interface AuditDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  eventId: Types.ObjectId;
  eventTitle: string;
  claimedRewards?: RewardDocument[];
  timestamp: Date;
}

export const AuditSchema = new Schema<AuditDocument>(
  {
    userId: Types.ObjectId,
    username: String,
    eventId: Types.ObjectId,
    eventTitle: String,
    claimedRewards: [RewardSchema],
    timestamp: { type: Date, default: Date.now },
  },
  { timeseries: { timeField: "timestamp", metaField: "targetType" } },
);
