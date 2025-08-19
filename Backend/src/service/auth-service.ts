import { UserModel } from "../model/user-model";
import { User } from "../model/user-model";
import bcrypt from "bcrypt";

const EMAIL_ALREADY_REGISTERED_MESSAGE =
  'This email address is already registered. Please log in, or use the "Forgot Password?" link if you need to reset your password.';

  const SALT_NUM = 10;
export class AuthService {
  /*async registerNewUser(newUser: Omit<User, "_id">): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: newUser.email });
      if (user) throw Error(EMAIL_ALREADY_REGISTERED_MESSAGE);
      const password_hash = await bcrypt.hash(newUser.password_hash,)
      
      const userCreated = await UserModel.create(newUser);
      return userCreated.toObject();
    } catch (e) {
      throw e;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email: email });
    } catch (e) {
      throw e;
    }
  }*/
}
