import { Role } from "apps/gateway/src/roles/role.enum";
import { Schema, Document, Types } from "mongoose";

interface Condition {
  loginStreakDays: number;
  referralCount: number;
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
}

const ConditionSchema = new Schema(
  {
    loginStreakDays: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
  },
  { _id: false },
);

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: Role.USER,
    enum: [Role.USER, Role.ADMIN, Role.AUDITOR, Role.OPERATOR],
  },
  active: { type: Boolean, default: false },
  birthday: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, required: false },
  condition: { type: ConditionSchema, default: {} },
});
