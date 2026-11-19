import axiosClient from '../../../core/api/axiosClient';

export interface UserProfile {
  id: number;
  username: string;
  fullname: string | null;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BANNED';
  avatar: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullname: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileApi = {
  // Lấy thông tin cá nhân
  getMyProfile() {
    return axiosClient.get<UserProfile>('/users/me');
  },

  // Cập nhật thông tin cá nhân
  updateMyProfile(data: UpdateProfileRequest) {
    return axiosClient.patch<UserProfile>('/users/me', data);
  },

  // Đổi mật khẩu
  changePassword(data: ChangePasswordRequest) {
    return axiosClient.patch<UserProfile>('/users/change-password', data);
  },
};