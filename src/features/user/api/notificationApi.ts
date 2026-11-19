import axiosClient from '../../../core/api/axiosClient';
import type { PaginationResponse } from '../../../core/types/api';

export type NotificationType = 'System' | 'From_Admin' | 'Database';

export interface NotificationResponse {
  id: number;
  idUser: number;
  idDB: number | null;
  content: string;
  isRead: boolean;
  link: string | null;
  typeNotification: NotificationType;
  createdAt: string;
}

export const notificationApi = {
  // Lấy danh sách thông báo (phân trang)
  getNotifications(page: number = 0, size: number = 10) {
    return axiosClient.get<PaginationResponse<NotificationResponse>>(
      `/notifications?page=${page}&size=${size}`
    );
  },

  // Đếm số thông báo chưa đọc
  countUnread() {
    return axiosClient.get<number>('/notifications/unread-count');
  },

  // Đánh dấu 1 thông báo đã đọc
  markAsRead(id: number) {
    return axiosClient.patch<void>(`/notifications/${id}/read`);
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead() {
    return axiosClient.patch<void>('/notifications/read-all');
  },
};