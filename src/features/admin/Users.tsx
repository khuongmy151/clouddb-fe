// src/features/admin/Users.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Lock, Unlock, Loader2, AlertCircle } from 'lucide-react';
import { userApi } from './api/userApi';
import type { UserResponse } from './types/user';

export default function Users() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'' | 'ADMIN' | 'USER'>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'ACTIVE' | 'BANNED'>('');

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // State cho các thao tác (xóa, ban, unban)
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getUsers({
        keyword: search.trim() || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });
      setUsers(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    // Debounce tìm kiếm
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Reset page khi thay đổi bộ lọc
  useEffect(() => {
    setPage(0);
  }, [search, roleFilter, statusFilter]);

  // Xử lý xóa người dùng
  const handleDelete = async (username: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${username}"?`)) return;
    setDeletingUser(username);
    try {
      await userApi.deleteUser(username);
      setActionMessage({ type: 'success', text: `Đã xóa người dùng "${username}"` });
      fetchUsers();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Xóa người dùng thất bại',
      });
    } finally {
      setDeletingUser(null);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // Xử lý Ban / Unban
  const handleToggleBan = async (user: UserResponse) => {
    try {
      if (user.status === 'ACTIVE') {
        const reason = window.prompt(`Nhập lý do khóa tài khoản "${user.username}":`);
        if (!reason || !reason.trim()) return; // Hủy nếu không nhập lý do
        await userApi.banUser(user.username, reason.trim());
        setActionMessage({ type: 'success', text: `Đã khóa tài khoản "${user.username}"` });
      } else {
        await userApi.unbanUser(user.username);
        setActionMessage({ type: 'success', text: `Đã mở khóa tài khoản "${user.username}"` });
      }
      fetchUsers(); // Reload danh sách
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Thao tác thất bại',
      });
    } finally {
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề + nút Thêm */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách người dùng</h1>
        <Link
          to="/users/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </Link>
      </div>

      {/* Thông báo Action */}
      {actionMessage && (
        <div
          className={`p-3 rounded-lg text-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="BANNED">Bị khóa</option>
        </select>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tên đăng nhập</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Họ tên</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Vai trò</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Trạng thái Loading */}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {/* Trạng thái Lỗi */}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-600">
                    <AlertCircle className="w-5 h-5 inline-block mr-2" />
                    {error}
                  </td>
                </tr>
              )}

              {/* Trạng thái Không có dữ liệu */}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không có người dùng nào phù hợp
                  </td>
                </tr>
              )}

              {/* Hiển thị dữ liệu */}
              {!loading &&
                !error &&
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{user.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-7 h-7 rounded-full bg-gray-100"
                        />
                      )}
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{user.fullname}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Nút Sửa */}
                        <Link
                          to={`/users/edit/${user.username}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        
                        {/* Nút Xóa */}
                        <button
                          onClick={() => handleDelete(user.username)}
                          disabled={deletingUser === user.username}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Xóa"
                        >
                          {deletingUser === user.username ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Nút Khóa / Mở khóa */}
                        <button
                          onClick={() => handleToggleBan(user)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          title={user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                        >
                          {user.status === 'ACTIVE' ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>
            Hiển thị {users.length === 0 ? 0 : page * pageSize + 1} -{' '}
            {Math.min((page + 1) * pageSize, totalElements)} / {totalElements}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {/* Render số trang */}
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 border rounded ${
                  page === i
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}