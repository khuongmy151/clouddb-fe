import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Lock, Unlock } from 'lucide-react';
import { mockUsers } from '../../data/mock';
import type { User } from '../../types';

export default function Users() {
  const [search, setSearch] = useState('');
  const [users] = useState<User[]>(mockUsers);

  // Lọc theo từ khóa tìm kiếm
  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          <option>Tất cả vai trò</option>
          <option>ADMIN</option>
          <option>USER</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          <option>Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Bị khóa</option>
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
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-gray-700">{user.fullName}</td>
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
                        user.status === 'Hoạt động'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        title={user.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                      >
                        {user.status === 'Hoạt động' ? (
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

        {/* Phân trang giả */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>
            Hiển thị 1 - {filtered.length} / {users.length}
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}