import { Document, Schema, Types, model } from "mongoose";

export interface Project extends Document {
  _id: Types.ObjectId;
  title: string;
  creatorId: Types.ObjectId;
  memberIds: Types.ObjectId[];
  fileIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<Project>(
  {
    title: { type: String, required: true, maxLength: 100 },
    memberIds: [{ type: Schema.Types.ObjectId }],
    creatorId: { type: Schema.Types.ObjectId, required: true },
    fileIds: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

export const ProjectModel = model<Project>("Project", ProjectSchema);
