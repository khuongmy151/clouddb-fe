// src/features/admin/api/userApi.ts
import axiosClient from '../../../core/api/axiosClient';
import type { PaginationResponse } from '../../../core/types/api';
import type { 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserQueryParams 
} from '../types/user';

export const userApi = {
  // Lấy danh sách users (có phân trang + filter)
  getUsers: async (params: UserQueryParams = {}): Promise<PaginationResponse<UserResponse>> => {
    const { data } = await axiosClient.get('/users', { params });
    return data;
  },

  // Tạo user mới
  createUser: async (payload: CreateUserRequest): Promise<UserResponse> => {
    const { data } = await axiosClient.post('/users/createUser', payload);
    return data;
  },

  // Ban user
  banUser: async (username: string, banReason: string): Promise<UserResponse> => {
    const { data } = await axiosClient.patch(`/users/${username}/ban`, { banReason });
    return data;
  },

  // Unban user
  unbanUser: async (username: string): Promise<UserResponse> => {
    const { data } = await axiosClient.patch(`/users/${username}/unban`);
    return data;
  },

  // Xóa user
  deleteUser: async (username: string): Promise<void> => {
    await axiosClient.delete(`/users/${username}`);
  },

  // Lấy profile của chính mình
  getMyProfile: async (): Promise<UserResponse> => {
    const { data } = await axiosClient.get('/users/me');
    return data;
  },

  // Cập nhật profile của chính mình
  updateMyProfile: async (payload: UpdateUserRequest): Promise<UserResponse> => {
    const { data } = await axiosClient.patch('/users/me', payload);
    return data;
  },
};