import { Document, model, Schema, Types } from "mongoose";

export interface File extends Document {
  _id: Types.ObjectId;
  name: string;
  creatorId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<File>({
  name: { type: String, required: true, maxLength: 100 },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
});

export const FileModel = model<File>("File", FileSchema);
