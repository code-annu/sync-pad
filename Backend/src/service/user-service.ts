import { UserModel, User } from "../model/user-model";

export class UserService {
  async findUserById(userId: string): Promise<User> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw Error("User not found!");
      return user.toObject();
    } catch (e) {
      throw e;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) throw Error("User not found!");
      return user.toObject();
    } catch (e) {
      throw e;
    }
  }
}
