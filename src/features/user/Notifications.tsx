import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Check,
  Loader2,
} from 'lucide-react';
import { useNotifications } from './NotificationContext';
import { formatRelativeTime } from '../../core/utils/date';
import type { NotificationResponse } from './api/notificationApi';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  System: Info,
  From_Admin: CheckCircle,
  Database: AlertTriangle,
};

const colorMap: Record<string, string> = {
  System: 'text-blue-600 bg-blue-50',
  From_Admin: 'text-emerald-600 bg-emerald-50',
  Database: 'text-amber-600 bg-amber-50',
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'System', label: 'Hệ thống' },
  { value: 'From_Admin', label: 'Thông báo từ admin' },
  { value: 'Database', label: 'Database' },
] as const;

const READ_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'read', label: 'Đã đọc' },
] as const;

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    page,
    totalPages,
    fetchNotifications,
  } = useNotifications();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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

  // Lọc (client-side trên trang hiện tại)
  const filtered = useMemo(() => {
    let result = [...notifications];

    if (filterType !== 'all') {
      result = result.filter((n) => n.typeNotification === filterType);
    }

    if (readFilter === 'unread') {
      result = result.filter((n) => !n.isRead);
    } else if (readFilter === 'read') {
      result = result.filter((n) => n.isRead);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter((n) =>
        n.content.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [notifications, filterType, readFilter, search]);

  const handleSearchChange = (value: string) => setSearch(value);
  
  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setShowFilterDropdown(false);
  };
  
  const handleReadFilterChange = (value: 'all' | 'unread' | 'read') => setReadFilter(value);

  const handleNotificationClick = async (n: NotificationResponse) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
    setOpenMenuId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    fetchNotifications(newPage);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">THÔNG BÁO</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between gap-2 min-w-[180px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition"
          >
            <span>{FILTER_OPTIONS.find((o) => o.value === filterType)?.label || 'Tất cả'}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                    filterType === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
        <button
          onClick={markAllAsRead}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
        >
          <Check className="w-4 h-4" />
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px]">
        <div className="grid grid-cols-[140px_1fr_40px] bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="px-4 py-3">Thời gian</div>
          <div className="px-4 py-3">Nội dung</div>
          <div className="px-2 py-3" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((n) => {
              const Icon = iconMap[n.typeNotification] || Info;
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`grid grid-cols-[140px_1fr_40px] cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="px-4 py-3.5 text-sm text-gray-500 flex items-start gap-2">
                    <span className="mt-0.5">{formatRelativeTime(n.createdAt)}</span>
                  </div>

                  <div className="px-4 py-3.5 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[n.typeNotification] || 'text-gray-500 bg-gray-50'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {n.content}
                      </p>
                      {n.link && <p className="text-xs text-gray-400 mt-1">Xem chi tiết</p>}
                    </div>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />}
                  </div>

                  <div
                    className="relative flex items-start justify-center pt-3.5"
                    ref={openMenuId === n.id ? menuRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setOpenMenuId(openMenuId === n.id ? null : n.id)}
                      className="p-1.5 rounded-full hover:bg-gray-200 transition text-gray-500"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === n.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {!n.isRead ? (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                            Đánh dấu đã đọc
                          </button>
                        ) : (
                          <div className="px-3 py-2.5 text-sm text-gray-400">Đã đọc</div>
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
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" /> Trước
            </button>
            <span className="px-3 text-sm text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sau <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}