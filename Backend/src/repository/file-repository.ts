import { Types } from "mongoose";
import { FileModel, File } from "../model/file-model";

export class FileRepository {
  async saveFile(fileData: {
    name: string;
    content: string;
    creatorId: string | Types.ObjectId;
  }): Promise<File> {
    const file = new FileModel(fileData);
    const savedFile = await file.save();
    return savedFile.toObject();
  }

  async updateFileContent(
    id: Types.ObjectId | string,
    content: string
  ): Promise<File | null> {
    const updatedFile = await FileModel.findByIdAndUpdate(id, {
      $set: { content: content },
    });
    return updatedFile ? updatedFile.toObject() : null;
  }

  async updateFileName(
    id: Types.ObjectId | string,
    name: string
  ): Promise<File | null> {
    const updatedFile = await FileModel.findByIdAndUpdate(id, {
      $set: { name: name },
    });
    return updatedFile ? updatedFile.toObject() : null;
  }

  async deleteFile(id: string): Promise<File | null> {
    const deletedFile = await FileModel.findByIdAndDelete(id);
    return deletedFile ? deletedFile.toObject() : null;
  }
}
