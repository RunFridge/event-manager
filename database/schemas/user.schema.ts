import { Role } from "apps/gateway/src/roles/role.enum";
import { Schema, Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "user" | "admin" | "operator" | "auditor";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: Role.USER,
    enum: [Role.USER, Role.ADMIN, Role.AUDITOR, Role.OPERATOR],
  },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
