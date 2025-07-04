import api from '@/api';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse, RegisterRequest>('/auth/register', data);

export const login = (data: LoginRequest) =>
  api.post<AuthResponse, LoginRequest>('/auth/login', data);
