import { UserModel, User, UserDocument } from "../model/user-model";
import { UpdateUserRequest } from "../types/user-types";

export class UserRepository {
  async getUserById(userId: string): Promise<UserDocument> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw Error(`User not found with id ${userId}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) throw Error(`User not found with email ${email}`);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(
    userId: string,
    userData: UpdateUserRequest
  ): Promise<UserDocument> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        $set: userData,
      });
      if (!updatedUser) throw Error("Unable to update user");
      return updatedUser;
    } catch (e) {
      throw e;
    }
  }
}
