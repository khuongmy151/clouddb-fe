import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationApi, type NotificationResponse } from './api/notificationApi';
import { useAuth } from '../auth/AuthContext';

interface NotificationContextType {
  notifications: NotificationResponse[];
  unreadCount: number;
  loading: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  fetchNotifications: (pageToFetch?: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setPage: (p: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  // Lấy user và loading từ AuthContext
  const { user, loading: authLoading } = useAuth();
  
  // Chỉ coi là đã đăng nhập khi user có dữ liệu
  const isAuthenticated = !!user;

  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const fetchNotifications = async (pageToFetch = page) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications(pageToFetch, PAGE_SIZE);
      setNotifications(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Lỗi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationApi.countUnread();
      setUnreadCount(res.data);
    } catch (error) {
      console.error('Lỗi đếm thông báo chưa đọc:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Lỗi đánh dấu đã đọc:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi đánh dấu tất cả đã đọc:', error);
    }
  };

  // 1. Load dữ liệu lần đầu (đợi authLoading xong mới chạy)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchNotifications(0);
      fetchUnreadCount();
    }
    // Reset dữ liệu nếu user logout
    if (!authLoading && !isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setPage(0);
    }
  }, [authLoading, isAuthenticated]);

  // 2. REALTIME SSE
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const eventSource = new EventSource(`${baseUrl}/notifications/subscribe`, {
      withCredentials: true,
    });

    eventSource.addEventListener('notification', (e) => {
      try {
        const newNotif: NotificationResponse = JSON.parse(e.data);
        
        // Thêm vào đầu danh sách
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setTotalElements((prev) => prev + 1);
        
        console.log('🔔 Có thông báo mới:', newNotif);
      } catch (err) {
        console.error('Lỗi parse SSE data:', err);
      }
    });

    eventSource.onerror = (err) => {
      // Lỗi này thường xảy ra khi mất kết nối mạng, trình duyệt sẽ tự retry
      console.warn('SSE Error (có thể do mất mạng, đang tự kết nối lại):', err);
    };

    return () => {
      eventSource.close();
    };
  }, [authLoading, isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        totalElements,
        totalPages,
        page,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        setPage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};