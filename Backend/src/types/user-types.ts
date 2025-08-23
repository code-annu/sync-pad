interface BaseUser {
  email: string;
  name: string;
}

export interface UserCreate extends BaseUser {
  passwordHash: string;
}

// export interface UserUpdate extends Partial<BaseUser> {}

