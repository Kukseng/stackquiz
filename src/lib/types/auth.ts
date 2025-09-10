// types/auth.ts
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
  };
  error?: string;
  timestamp: number;
}