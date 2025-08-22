export interface BaseUser {
  email: string;
  name: string;
  project_ids: [string];
}

export interface RegisterUserRequest extends Pick<BaseUser, "email" | "name"> {
  password: string;
}

export interface UpdateUserRequest extends Partial<BaseUser> {}
