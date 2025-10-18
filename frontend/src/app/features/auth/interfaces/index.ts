export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  token?: string;
  userId?: number;
}