// ====================== USER ======================
export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'Hoạt động' | 'Bị khóa';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// ====================== DATABASE ======================
export type DbType = 'MySQL' | 'PostgreSQL' | 'MongoDB';
export type DbStatus = 'Running' | 'Stopped' | 'Creating' | 'Error';

export interface Database {
  id: number;
  name: string;
  type: DbType;
  /** Cấu hình */
  cpu: string;        // ví dụ: "2 vCPU"
  ram: string;        // ví dụ: "4 GB"
  storage: string;    // ví dụ: "50 GB"
  /** Thông tin kết nối */
  host?: string;
  port?: number;
  username?: string;
  password?: string;  // chỉ hiện khi xem chi tiết (có thể mask)
  /** Meta */
  status: DbStatus;
  version?: string;   // ví dụ: "PostgreSQL 17.1"
  createdAt: string;
  owner?: string;
  /** Backup */
  backupSchedule?: string; // "Mỗi ngày 1 lần lúc 02:00"
}

// ====================== BACKUP ======================
export type BackupStatus = 'Hoàn tất' | 'Thất bại' | 'Đang chạy';

export interface Backup {
  id: number;
  dbId: number;
  name: string;
  size: string;
  status: BackupStatus;
  time: string;
}

// ====================== ACTIVITY / LOG ======================
export interface Activity {
  id: number;
  user: string;
  action: string;
  description: string;
  time: string;
  dbId?: number;
}

// ====================== NOTIFICATION ======================
export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  time: string;
  read: boolean;
  link?: string;
}