import { Schema, model, Types, Document } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  projectIds: [Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [emailRegex, "Please provide a valid email address"],
  },
  passwordHash: { type: String, required: [true, "Password is required"] },
  name: {
    type: String,
    maxLength: [100, "Name must not exceed 100 length"],
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  projectIds: [{ type: Types.ObjectId, required: true }],
});

export const User = model<UserDocument>("User", UserSchema);
