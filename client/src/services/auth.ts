import api from '@/lib/axios';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Register new user
export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Verify email with token
export const verifyEmail = async (token: string) => {
  const response = await api.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Resend verification email
export const resendVerification = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

// Google OAuth login
export const googleLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
};

// Forgot password - send reset email
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password with token
export const resetPassword = async (token: string, password: string) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};
