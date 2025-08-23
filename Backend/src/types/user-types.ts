interface BaseUser {
  email: string;
  name: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserUpdateRequest {
  email: string;
  name: string;
}

export interface UserCreate extends BaseUser {
  passwordHash: string;
}

export interface UserUpdate extends Partial<BaseUser> {}

export interface UserResponse extends BaseUser {}
