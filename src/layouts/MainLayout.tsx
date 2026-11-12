import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Users,
  Database,
  Bell,
  Activity,
  Settings,
  LogOut,
  HardDrive,
  Server,
  User,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';
import { mockNotifications } from '../data/mock';
import { useAuth } from '../features/auth/AuthContext';

type MenuItem =
  | { to: string; icon: React.ComponentType<{ className?: string }>; label: string; type?: never }
  | { type: 'divider'; to?: never; icon?: never; label?: never };

const menuItems: MenuItem[] = [
  { to: '/dashboard', icon: Home, label: 'Trang chủ' },
  { to: '/databases', icon: Database, label: 'Database của tôi' },
  { type: 'divider' },
  { to: '/admin/databasess', icon: Database, label: 'Quản lý Database' },
  { to: '/users', icon: Users, label: 'Quản lý người dùng' },
  // Đã bỏ Thông báo khỏi sidebar (chuyển lên chuông)
  { to: '/monitoring', icon: Server, label: 'Giám sát hệ thống' },
  { to: '/activities', icon: Activity, label: 'Nhật ký hoạt động' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
];

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-500 bg-emerald-50',
  warning: 'text-amber-500 bg-amber-50',
  error: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50',
};

export default function MainLayout() {
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Lấy tối đa 7 thông báo để hiện trong dropdown
  const recentNotifs = mockNotifications.slice(0, 7);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    setOpenUserMenu(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setOpenUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <HardDrive className="w-7 h-7 text-blue-400" />
            <span className="font-bold text-lg">DB Management</span>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-2 mx-4 border-t border-slate-700"
                />
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-500">
            Hệ thống quản lý & cấp phát cơ sở dữ liệu
          </div>
          <div className="flex items-center gap-3">
            {/* ========== CHUÔNG THÔNG BÁO ========== */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setOpenNotif(!openNotif);
                  setOpenUserMenu(false);
                }}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown thông báo */}
              {openNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">Thông báo</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-600 font-medium">
                        {unreadCount} chưa đọc
                      </span>
                    )}
                  </div>

                  {/* Danh sách ~7 thông báo */}
                  <div className="max-h-80 overflow-y-auto">
                    {recentNotifs.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        Không có thông báo
                      </div>
                    ) : (
                      recentNotifs.map((n) => {
                        const Icon = iconMap[n.type as keyof typeof iconMap];
                        return (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/40' : ''
                              }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[n.type as keyof typeof colorMap]
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-snug ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'
                                  }`}
                              >
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Nút Tất cả */}
                  <div className="border-t border-gray-100">
                    <Link
                      to="/notifications"
                      onClick={() => setOpenNotif(false)}
                      className="block w-full text-center py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                    >
                      Tất cả
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ========== DROPDOWN USER ========== */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setOpenUserMenu(!openUserMenu);
                  setOpenNotif(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
              >
                {/* Avatar */}
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium uppercase">
                    {user?.username?.[0] ?? '?'}
                  </div>
                )}

                <span className="text-sm font-medium">
                  {user?.username ?? '...'}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition ${openUserMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setOpenUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Thông tin người dùng
                  </Link>
                  <Link
                    to="/my-activities"
                    onClick={() => setOpenUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Activity className="w-4 h-4 text-gray-400" />
                    Nhật ký của tôi
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}