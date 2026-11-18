// src/features/admin/UserForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, Upload, Key, Loader2, AlertCircle } from 'lucide-react';
import { userApi } from './api/userApi';
import type { UserResponse } from './types/user';

export default function UserForm() {
  const navigate = useNavigate();
  const { id: usernameParam } = useParams<{ id: string }>();
  const location = useLocation();

  const isEdit = Boolean(usernameParam);
  // true = đang sửa từ trang Profile (user tự sửa thông tin của mình)
  const fromProfile = location.state?.from === 'profile';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State form đồng bộ với backend (dùng chữ thường fullname, status dạng ENUM)
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN',
    status: 'ACTIVE' as 'ACTIVE' | 'BANNED',
  });

  // Load dữ liệu khi ở chế độ Edit
  useEffect(() => {
    if (!isEdit || !usernameParam) return;

    const loadUser = async () => {
      setFetching(true);
      setError(null);
      try {
        let data: UserResponse;
        if (fromProfile) {
          data = await userApi.getMyProfile();
        } else {
          // Lấy danh sách user và tìm theo username (vì BE chưa có API get by username cho admin)
          // Hoặc bạn có thể viết thêm API GET /users/{username} ở BE
          const res = await userApi.getUsers({ keyword: usernameParam, size: 1 });
          const found = res.content.find((u) => u.username === usernameParam);
          if (!found) throw new Error('Không tìm thấy người dùng');
          data = found;
        }

        setForm({
          username: data.username,
          fullname: data.fullname || '',
          email: data.email || '',
          role: data.role,
          status: data.status,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Không thể tải thông tin người dùng');
      } finally {
        setFetching(false);
      }
    };

    loadUser();
  }, [isEdit, usernameParam, fromProfile]);

  const handleNavigateBack = () => {
    if (fromProfile) {
      navigate('/profile');
    } else {
      navigate('/users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      if (fromProfile) {
        // Cập nhật profile cá nhân
        await userApi.updateMyProfile({
          fullname: form.fullname.trim(),
          email: form.email.trim(),
        });
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      } else if (isEdit) {
        // Admin sửa user khác 
        // Lưu ý: Backend hiện tại chưa có API cho Admin sửa user khác (chỉ có /me)
        // Nếu bạn đã thêm API PATCH /users/{username} ở BE thì gọi ở đây
        setMessage({ type: 'error', text: 'Chức năng sửa người dùng khác chưa được hỗ trợ ở backend' });
        setLoading(false);
        return;
      } else {
        // Tạo user mới
        // Sinh password ngẫu nhiên (Vì BE yêu cầu password trong request)
        const randomPassword = Math.random().toString(36).slice(-8) + 'Aa1@';
        
        await userApi.createUser({
          username: form.username.trim(),
          password: randomPassword,
          fullname: form.fullname.trim(),
          email: form.email.trim(),
          role: form.role,
          status: form.status,
        });
        
        setMessage({
          type: 'success',
          text: 'Tạo người dùng thành công! Mật khẩu đã được gửi qua email.',
        });
      }

      // Quay về sau 1.2s
      setTimeout(() => {
        handleNavigateBack();
      }, 1200);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Thao tác thất bại, vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {fromProfile
              ? 'Chỉnh sửa thông tin cá nhân'
              : isEdit
              ? 'Sửa người dùng'
              : 'Thêm người dùng'}
          </h2>
          <button
            onClick={handleNavigateBack}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Hiển thị lỗi load data */}
          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Hiển thị thông báo submit */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Nhập tên đăng nhập"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                required
                disabled={fromProfile || isEdit}
              />
              {(fromProfile || isEdit) && (
                <p className="text-xs text-gray-400 mt-1">Không thể thay đổi tên đăng nhập</p>
              )}
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                placeholder="Nhập họ tên"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Nhập email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                required
                disabled={fromProfile || isEdit} // Thường email cũng ko cho đổi
              />
            </div>
          </div>

          {/* Chỉ hiện Vai trò + Trạng thái khi Admin thêm/sửa user */}
          {!fromProfile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as 'USER' | 'ADMIN' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isEdit}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as 'ACTIVE' | 'BANNED',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isEdit} // Thường trạng thái đổi qua nút Ban/Unban
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="BANNED">Bị khóa</option>
                </select>
              </div>
            </div>
          )}

          {/* Thông báo về mật khẩu */}
          {!fromProfile && !isEdit && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              <Key className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Hệ thống sẽ <strong>tự tạo mật khẩu ngẫu nhiên</strong> và gửi đến email của người dùng.
                Admin không được tự đặt mật khẩu.
              </p>
            </div>
          )}

          {/* Ảnh đại diện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <Upload className="w-6 h-6" />
              </div>
              <button
                type="button"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Chọn ảnh
              </button>
            </div>
          </div>

          {/* Nút */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleNavigateBack}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Cập nhật' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}