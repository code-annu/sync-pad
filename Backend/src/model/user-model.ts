import { Schema, model, Types, Document } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface User extends Document {
  _id: Types.ObjectId;
  email: string;
  password_hash: string;
  name: string;
  project_ids: Types.ObjectId[];
}

export interface UserCreate extends Omit<User, "_id" | "password_hash"> {
  password: string;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [emailRegex, "Please provide a valid email address"],
  },
  password_hash: { type: String, required: [true, "Password is required"] },
  name: {
    type: String,
    maxLength: [100, "Name must not exceed 100 length"],
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  project_ids: { type: [Types.ObjectId], required: false },
});

export const UserModel = model<User>("User", UserSchema);
