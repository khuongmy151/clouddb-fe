import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Check,
} from 'lucide-react';
import { mockNotifications } from '../../data/mock';
import type { Notification } from '../../types';

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
  info: 'text-blue-600 bg-blue-50',
};

// Bộ lọc theo loại
const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'system', label: 'Hệ thống' },
  { value: 'admin', label: 'Thông báo từ admin' },
  { value: 'database', label: 'Database' },
] as const;

// Bộ lọc theo trạng thái đọc
const READ_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'read', label: 'Đã đọc' },
] as const;

const PAGE_SIZE = 6;

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== Lọc + Tìm kiếm =====
  const filtered = useMemo(() => {
    let result = [...notifications];

    // Lọc theo loại
    if (filterType === 'system') {
      result = result.filter((n) => n.type === 'warning' || n.type === 'info');
    } else if (filterType === 'admin') {
      result = result.filter((n) => n.type === 'success');
    } else if (filterType === 'database') {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes('database') ||
          n.title.toLowerCase().includes('db_')
      );
    }

    // Lọc theo trạng thái đọc
    if (readFilter === 'unread') {
      result = result.filter((n) => !n.read);
    } else if (readFilter === 'read') {
      result = result.filter((n) => n.read);
    }

    // Tìm kiếm
    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(keyword) ||
          (n.message && n.message.toLowerCase().includes(keyword))
      );
    }

    return result;
  }, [notifications, filterType, readFilter, search]);

  const handleMarkAllAsRead = () => {
  setNotifications((prev) =>
    prev.map((n) => ({ ...n, read: true }))
  );
};
  // ===== Phân trang =====
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  const handleReadFilterChange = (value: 'all' | 'unread' | 'read') => {
    setReadFilter(value);
    setCurrentPage(1);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setOpenMenuId(null);
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header: Quay lại + Tiêu đề */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">THÔNG BÁO</h1>

      {/* Thanh tìm kiếm + Bộ lọc loại */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Dropdown lọc loại */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between gap-2 min-w-[180px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition"
          >
            <span>
              {FILTER_OPTIONS.find((o) => o.value === filterType)?.label || 'Tất cả'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                    filterType === option.value
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 nút: Tất cả / Chưa đọc / Đã đọc */}
      <div className="flex gap-2">
        {READ_FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleReadFilterChange(option.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
              readFilter === option.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
          
        ))}
        {/* Nút Đánh dấu tất cả đã đọc */}
          <button
            onClick={handleMarkAllAsRead}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
          >
            <Check className="w-4 h-4" />
            Đánh dấu tất cả đã đọc
          </button>
      </div>

      {/* Bảng thông báo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header bảng */}
        <div className="grid grid-cols-[140px_1fr_40px] bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="px-4 py-3">Thời gian</div>
          <div className="px-4 py-3">Nội dung</div>
          <div className="px-2 py-3" />
        </div>

        {/* Danh sách */}
        {paginated.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {paginated.map((n) => {
              const Icon = iconMap[n.type];
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`grid grid-cols-[140px_1fr_40px] cursor-pointer transition-colors ${
                    !n.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Cột Thời gian */}
                  <div className="px-4 py-3.5 text-sm text-gray-500 flex items-start gap-2">
                    <span className="mt-0.5">{formatTime(n.time)}</span>
                  </div>

                  {/* Cột Nội dung */}
                  <div className="px-4 py-3.5 flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[n.type]}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          !n.read ? 'font-semibold text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {n.message}
                        </p>
                      )}
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    )}
                  </div>

                  {/* Cột 3 chấm */}
                  <div
                    className="relative flex items-start justify-center pt-3.5"
                    ref={openMenuId === n.id ? menuRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === n.id ? null : n.id)
                      }
                      className="p-1.5 rounded-full hover:bg-gray-200 transition text-gray-500"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === n.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {!n.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                            Đánh dấu đã đọc
                          </button>
                        )}
                        {n.read && (
                          <div className="px-3 py-2.5 text-sm text-gray-400">
                            Đã đọc
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Bell className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Không có thông báo</p>
            <p className="text-sm text-gray-400 mt-1">
              {search || readFilter !== 'all'
                ? 'Thử tìm với từ khóa khác hoặc đổi bộ lọc'
                : 'Hiện tại chưa có thông báo nào'}
            </p>
          </div>
        )}

        {/* Phân trang */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </button>

            <span className="px-3 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}