export interface UserResponse {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BANNED';
  avatar: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateUserRequest {
  fullname: string;
  email?: string;
}

export interface BanUserRequest {
  banReason: string;
}

export interface UserQueryParams {
  keyword?: string;
  role?: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'BANNED';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}