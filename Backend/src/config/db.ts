import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const DATABASE_NAME = process.env.DATABASE_NAME!;
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
