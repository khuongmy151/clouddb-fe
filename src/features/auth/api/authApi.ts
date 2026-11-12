// src/features/auth/api/authApi.ts
import axios from 'axios'; // hoặc fetch nếu bạn không dùng axios

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'; // chỉnh port backend của bạn

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  role: string;
  avatar_url: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axios.post(`${API_BASE}/auth/login`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_BASE}/auth/logout`, null, { withCredentials: true });
  },

  me: async (): Promise<LoginResponse> => {
    const res = await axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
    return res.data;
  },
};