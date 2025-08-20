import { Schema, Types, model } from "mongoose";

export interface RefreshToken extends Document {
  _id?: Types.ObjectId;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt?: Date;
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    token: { type: String, required: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, collection: "refresh_tokens" }
);

export const RefreshTokenModel = model<RefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
