import { Document, Schema, Types, model } from "mongoose";
import { BaseProject } from "../types/project-types";

export interface ProjectDocument extends BaseProject, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, maxLength: 100 },
    memberIds: { type: [String] },
    pendingMemberIds: { type: [String] },
    fileIds: { type: [String] },
    creatorId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project = model<ProjectDocument>("Project", ProjectSchema);
