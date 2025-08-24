import { FileResponse } from "../response/file-response";
import { File } from "../model/file-model";
import { User } from "../model/user-model";

export function mapToFileResponse(file: File, creator: User) {
  const fileResponse: FileResponse = {
    id: file._id.toString(),
    name: file.name,
    content: file.content,
    createdAt: file.createdAt,
    creator: {
      id: creator._id.toString(),
      name: creator.name,
    },
  };
  return fileResponse;
}
