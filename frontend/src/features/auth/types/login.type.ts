import { User } from "./user.type";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "estudiante" | "profesor";
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_role: string;
  message?: string;
}