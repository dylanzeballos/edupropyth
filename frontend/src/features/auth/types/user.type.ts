export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "Estudiante" | "Profesor" | "Admin";
  isActive: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}