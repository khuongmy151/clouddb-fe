import {
  Database,
  Activity,
  Zap,
  CheckCircle2,
  HardDrive,
  AlertTriangle,
  LogIn,
  RefreshCw,
  Bell,
  ArrowRight,
  Server,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const recentDatabases = [
  {
    name: 'mydb_01',
    type: 'MySQL',
    size: '512 MB',
    status: 'Hoạt động',
    statusColor: 'bg-emerald-500',
    created: '22/10/2025 14:32',
    iconColor: 'text-orange-500',
  },
  {
    name: 'shop_db',
    type: 'PostgreSQL',
    size: '1.2 GB',
    status: 'Hoạt động',
    statusColor: 'bg-emerald-500',
    created: '20/10/2025 09:15',
    iconColor: 'text-blue-600',
  },
  {
    name: 'report_data',
    type: 'MySQL',
    size: '256 MB',
    status: 'Hoạt động',
    statusColor: 'bg-emerald-500',
    created: '18/10/2025 16:20',
    iconColor: 'text-orange-500',
  },
  {
    name: 'test_db',
    type: 'SQL Server',
    size: '768 MB',
    status: 'Đang tạm dừng',
    statusColor: 'bg-amber-400',
    created: '15/10/2025 11:42',
    iconColor: 'text-red-500',
  },
  {
    name: 'analytics',
    type: 'PostgreSQL',
    size: '1.5 GB',
    status: 'Hoạt động',
    statusColor: 'bg-emerald-500',
    created: '12/10/2025 10:05',
    iconColor: 'text-blue-600',
  },
];

const notifications = [
  {
    type: 'success',
    title: 'Cơ sở dữ liệu analytics được tạo thành công',
    desc: 'Hệ thống đã cấp phát cơ sở dữ liệu cho bạn.',
    time: '10:05',
  },
  {
    type: 'info',
    title: 'Sao lưu hoàn tất',
    desc: 'Sao lưu cơ sở dữ liệu shop_db đã hoàn thành.',
    time: '09:45',
  },
  {
    type: 'warning',
    title: 'Cảnh báo dung lượng',
    desc: 'Cơ sở dữ liệu report_data đã sử dụng 80% dung lượng.',
    time: '08:32',
  },
  {
    type: 'login',
    title: 'Đăng nhập hệ thống',
    desc: 'Bạn đã đăng nhập thành công vào hệ thống.',
    time: '06:58',
  },
];

const recentActivities = [
  {
    time: '22/10/2025 14:32',
    desc: 'Tạo cơ sở dữ liệu mới: mydb_01 (MySQL)',
    type: 'Tạo mới',
    typeColor: 'text-emerald-600',
    status: 'Thành công',
  },
  {
    time: '20/10/2025 09:15',
    desc: 'Sao lưu cơ sở dữ liệu: shop_db',
    type: 'Sao lưu',
    typeColor: 'text-blue-600',
    status: 'Thành công',
  },
  {
    time: '18/10/2025 16:20',
    desc: 'Xóa cơ sở dữ liệu: test_db',
    type: 'Xóa',
    typeColor: 'text-red-500',
    status: 'Thành công',
  },
  {
    time: '15/10/2025 11:42',
    desc: 'Cấp phát cơ sở dữ liệu: report_data (MySQL)',
    type: 'Cấp phát',
    typeColor: 'text-violet-600',
    status: 'Thành công',
  },
  {
    time: '12/10/2025 10:05',
    desc: 'Đăng nhập hệ thống',
    type: 'Đăng nhập',
    typeColor: 'text-gray-600',
    status: 'Thành công',
  },
];

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 p-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>Xin chào, Trúc My!</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Chào mừng bạn đến với hệ thống quản lý và cấp phát cơ sở dữ liệu CloudDB.
            </p>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-100">
              Thứ Năm, 23/10/2025
              <span className="text-gray-300">|</span>
              10:24
            </span>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden md:block">
          <Server className="w-32 h-32 text-sky-400" />
        </div>
      </div>

      {/* Stats + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total DBs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng số cơ sở dữ liệu</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đang hoạt động</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4 / 5</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <div className="relative">
                <Activity className="w-6 h-6 text-emerald-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Thao tác nhanh</h3>
          </div>
          <div className="space-y-2">
            <Link
              to="/databases/create"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Tạo cơ sở dữ liệu mới
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              to="/databases"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-violet-600" />
                Quản lý cơ sở dữ liệu
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content: Recent DBs + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent databases table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Cơ sở dữ liệu gần đây</h3>
            </div>
            <Link
              to="/databases"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-5 py-3">Tên cơ sở dữ liệu</th>
                  <th className="px-5 py-3">Loại</th>
                  <th className="px-5 py-3">Dung lượng</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDatabases.map((db) => (
                  <tr key={db.name} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Database className={`w-4 h-4 ${db.iconColor}`} />
                        <span className="font-medium text-gray-900">{db.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{db.type}</td>
                    <td className="px-5 py-3.5 text-gray-600">{db.size}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${db.statusColor}`} />
                        <span className="text-gray-700">{db.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{db.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {notifications.map((item, i) => (
              <div key={i} className="px-5 py-4 hover:bg-gray-50/50 transition">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === 'success'
                        ? 'bg-emerald-100 text-emerald-600'
                        : item.type === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : item.type === 'login'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {item.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {item.type === 'login' && <LogIn className="w-4 h-4" />}
                    {item.type === 'info' && <HardDrive className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Hoạt động gần đây</h3>
          </div>
          <Link
            to="/my-activities"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Xem tất cả
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-50">
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Mô tả hoạt động</th>
                <th className="px-5 py-3">Loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentActivities.map((act, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{act.time}</td>
                  <td className="px-5 py-3.5 text-gray-800">{act.desc}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${act.typeColor}`}>{act.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}