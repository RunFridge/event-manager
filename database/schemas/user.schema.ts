import { Role } from "apps/gateway/src/roles/role.enum";
import { Schema, Document, Types } from "mongoose";

interface Condition {
  loginStreakDays: number;
  referralCount: number;
}

interface Inventory {
  point: number;
  coupons: string[];
  items: string[];
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "user" | "admin" | "operator" | "auditor";
  active: boolean;
  birthday?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  condition: Condition;
  inventory: Inventory;
  claimedEventIds: Types.ObjectId[];
}

const ConditionSchema = new Schema(
  {
    loginStreakDays: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
  },
  { _id: false },
);

const InventorySchema = new Schema(
  {
    point: { type: Number, default: 0 },
    coupons: { type: [String], default: [] },
    items: { type: [String], default: [] },
  },
  { _id: false },
);

export const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: Role.USER,
      enum: [Role.USER, Role.ADMIN, Role.AUDITOR, Role.OPERATOR],
    },
    active: { type: Boolean, default: false },
    birthday: { type: Date, required: false },
    lastLoginAt: { type: Date, required: false },
    condition: { type: ConditionSchema, default: {} },
    inventory: { type: InventorySchema, default: {} },
    claimedEventIds: [Types.ObjectId],
  },
  { timestamps: true },
);
