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

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw Error(`User not found with id ${userId}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) throw Error(`User not found with email ${email}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(userId: string, updates: UserUpdate): Promise<User> {
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

  async addProjectId(userId: string, projectId: string): Promise<User> {
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
    userId: string,
    projectId: string
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
