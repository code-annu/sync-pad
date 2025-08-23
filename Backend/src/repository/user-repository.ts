import { Types } from "mongoose";
import { User, UserModel } from "../model/user-model";
import { UserCreate, UserUpdate } from "../types/user-types";

export class UserRepository {
  async saveUser(userData: UserCreate): Promise<User> {
    try {
      const user = new UserModel(userData);
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (e) {
      throw e;
    }
  }

  async getUserById(userId: string | Types.ObjectId): Promise<User | null> {
    const user = await UserModel.findById(userId);
    return user ? user.toObject() : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email });
    return user ? user.toObject() : null;
  }

  async updateUser(
    userId: string | Types.ObjectId,
    updates: UserUpdate
  ): Promise<User> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        $set: updates,
      });
      if (!updatedUser) throw Error("Unable to update user");
      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async addProjectId(
    userId: string | Types.ObjectId,
    projectId: string | Types.ObjectId
  ): Promise<User> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { projectIds: projectId } }, // Append projectIds array with Safely avoid duplicates: $addToSet
        { new: true }
      );
      if (!updatedUser) throw Error("Failed to Add project Id");
      return updatedUser.toObject();
    } catch (e) {
      throw e;
    }
  }

  async deleteProjectId(
    userId: string | Types.ObjectId,
    projectId: string | Types.ObjectId
  ): Promise<User> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { projectIds: projectId } },
        { new: true }
      );
      if (!updatedUser) throw Error("Failed to Remove project Id");
      return updatedUser.toObject();
    } catch (e) {
      throw e;
    }
  }
}
