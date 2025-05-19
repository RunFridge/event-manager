import { Schema, Document, Types } from "mongoose";

export interface AuditDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  action:
    | "login"
    | "register"
    | "rewardClaim"
    | "rewardCancel"
    | "activateUser"
    | "eventCreate"
    | "eventUpdate"
    | "eventDelete";
  targetId: Types.ObjectId;
  targetType: "user" | "reward" | "event";
  targetName: string;
  targetDescription: string;
  timestamp: Date;
}

export const AuditSchema = new Schema<AuditDocument>(
  {
    timestamp: { type: Date, default: Date.now },
  },
  { timeseries: { timeField: "timestamp", metaField: "targetType" } },
);
