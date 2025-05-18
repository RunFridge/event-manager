import { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  role: "user" | "operator" | "admin";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "user",
    enum: ["user", "operator", "admin"],
  },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
