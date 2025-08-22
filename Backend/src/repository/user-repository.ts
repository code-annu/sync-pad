import { UserDocument, User } from "../model/user-model";
import { UserCreate, UserUpdate } from "../types/user-types";

export class UserRepository {
  async createUser(userData: UserCreate): Promise<UserDocument> {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (e) {
      throw e;
    }
  }

  async getUserById(userId: string): Promise<UserDocument> {
    try {
      const user = await User.findById(userId);
      if (!user) throw Error(`User not found with id ${userId}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await User.findOne({ email: email });
      if (!user) throw Error(`User not found with email ${email}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(userId: string, updates: UserUpdate): Promise<UserDocument> {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: updates,
      });
      if (!updatedUser) throw Error("Unable to update user");
      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async addProjectId(userId: string, projectId: string): Promise<UserDocument> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
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
  ): Promise<UserDocument> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
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
