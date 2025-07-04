import api from '@/api';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';

export const register = async (data: RegisterRequest) =>
  await api.post<AuthResponse, RegisterRequest>('/auth/register', data);

export const login = async (data: LoginRequest) => {
  const res = await api.post<AuthResponse, LoginRequest>('/auth/login', data);
  return res;
};
