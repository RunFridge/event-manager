import { Document, Schema, Types } from "mongoose";

export interface RewardDocument extends Document {
  _id: Types.ObjectId;
  type: "point" | "coupon" | "item";
  title: string;
  description?: string;
  points?: number;
  coupons?: Types.ObjectId[];
  items?: Types.ObjectId[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RewardSchema = new Schema<RewardDocument>({
  type: {
    type: String,
    required: true,
    enum: ["point", "coupon", "item"],
  },
  title: String,
  description: String,
  points: {
    type: Number,
    required: function () {
      return this.type === "point";
    },
  },
  coupons: {
    type: [Types.ObjectId],
    required: function () {
      return this.type === "coupon";
    },
  },
  items: {
    type: [Types.ObjectId],
    required: function () {
      return this.type === "item";
    },
  },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
