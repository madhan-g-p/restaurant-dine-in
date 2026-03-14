import type { AuthResponse, LoginPayload, SignupPayload } from '../types';
import { mockUsers, generateMockToken } from '../mocks/mockData';
import axiosInstance from './axiosInstance';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const user = await axiosInstance.post('/auth/login', payload);
  return user.data;
}

export async function signupRequest(payload: SignupPayload): Promise<AuthResponse> {
  const user = await axiosInstance.post('/auth/signup', payload);
  return user.data;
}
