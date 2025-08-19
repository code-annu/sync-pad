import { UserCreate, UserModel } from "../model/user-model";
import { User } from "../model/user-model";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

const EMAIL_ALREADY_REGISTERED_MESSAGE =
  'This email address is already registered. Please log in, or use the "Forgot Password?" link if you need to reset your password.';

const EMAIL_NOT_FOUND = "Email not found!";
const INVALID_PASSWORD = "Invalid password!";

const SALT_NUM = 10;
export class AuthService {
  async registerNewUser(newUser: UserCreate): Promise<User> {
    try {
      var user = await UserModel.findOne({ email: newUser.email });
      if (user) throw Error(EMAIL_ALREADY_REGISTERED_MESSAGE);

      const password_hash = await bcrypt.hash(newUser.password, SALT_NUM);
      const project_ids: Types.ObjectId[] = [];

      const userCreated = await UserModel.create({
        email: newUser.email,
        password_hash: password_hash,
        name: newUser.name,
        project_ids: project_ids,
      });

      console.log(userCreated);
      return userCreated.toObject();
    } catch (e) {
      throw e;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) throw Error(EMAIL_NOT_FOUND);

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) throw Error(INVALID_PASSWORD);

      return user;
    } catch (e) {
      throw e;
    }
  }
}
