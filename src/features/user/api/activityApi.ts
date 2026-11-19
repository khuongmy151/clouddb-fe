import axiosClient from '../../../core/api/axiosClient';
import type { PaginationResponse } from '../../../core/types/api';

export type ActionType =
  | 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER'
  | 'BAN_USER' | 'UNBAN_USER' | 'CHANGE_PASSWORD'
  | 'LOGIN' | 'LOGOUT'
  | 'CREATE_DB' | 'UPDATE_DB' | 'DELETE_DB'
  | 'START_DB' | 'STOP_DB' | 'BACKUP_DB' | 'RESTORE_DB'
  | 'ASSIGN_ROLE';

export interface ActivityLogResponse {
  id: number;
  idUser: number;
  targetUser: number | null;
  targetDb: number | null;
  actionType: ActionType;
  description: string;
  createdAt: string;
  username: string | null;
  fullname: string | null;
  targetUsername: string | null;
}

export interface MyActivityLogQuery {
  actionType?: ActionType;
  targetUserId?: number;
  targetDbId?: number;
  page?: number;
  size?: number;
  sortBy?: 'id' | 'createdAt';
  sortDir?: 'ASC' | 'DESC';
}

export const myActivityApi = {
  // Lấy nhật ký của chính user đang đăng nhập
  getMyLogs(params: MyActivityLogQuery) {
    return axiosClient.get<PaginationResponse<ActivityLogResponse>>(
      '/activitylog/me',
      { params }
    );
  },
};