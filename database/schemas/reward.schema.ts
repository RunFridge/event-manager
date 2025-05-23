import { Document, Schema, Types } from "mongoose";

export const VALID_REWARD_TYPES = ["point", "coupon", "item"] as const;

export interface RewardDocument extends Document {
  _id: Types.ObjectId;
  type: "point" | "coupon" | "item";
  title: string;
  description?: string;
  point?: number;
  coupons?: string[];
  items?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RewardSchema = new Schema<RewardDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: VALID_REWARD_TYPES,
    },
    title: String,
    description: String,
    point: {
      type: Number,
      required: function () {
        return this.type === "point";
      },
    },
    coupons: {
      type: [String],
      required: function () {
        return this.type === "coupon";
      },
    },
    items: {
      type: [String],
      required: function () {
        return this.type === "item";
      },
    },
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);
