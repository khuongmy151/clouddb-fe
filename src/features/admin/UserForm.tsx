import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, Upload, Key } from 'lucide-react';
import { mockUsers } from '../../data/mock';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isEdit = Boolean(id);
  const existing = isEdit ? mockUsers.find((u) => u.id === Number(id)) : null;

  // true = đang sửa từ trang Profile (user tự sửa thông tin của mình)
  const fromProfile = location.state?.from === 'profile';

  const [form, setForm] = useState({
    username: existing?.username || '',
    fullName: existing?.fullName || '',
    email: existing?.email || '',
    phone: existing?.phone || '',
    address: existing?.address || '',
    role: existing?.role || 'USER',
    status: existing?.status || 'Hoạt động',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleNavigateBack = () => {
    if (fromProfile) {
      navigate('/profile');
    } else {
      navigate('/users');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // TODO: Gọi API
    // if (isEdit) {
    //   await api.updateUser(id, form);
    // } else {
    //   // Backend sẽ tự generate password + gửi email
    //   await api.createUser(form);
    // }

    setMessage({
      type: 'success',
      text: isEdit
        ? 'Cập nhật thông tin thành công!'
        : 'Tạo người dùng thành công! Mật khẩu đã được gửi qua email.',
    });

    // Quay về sau 1.2s
    setTimeout(() => {
      handleNavigateBack();
    }, 1200);
  };

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
            {/* Username - chỉ cho Admin sửa / tạo mới */}
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
                disabled={fromProfile || isEdit} // User không được đổi username, Admin cũng không đổi khi edit
              />
              {(fromProfile || isEdit) && (
                <p className="text-xs text-gray-400 mt-1">Không thể thay đổi tên đăng nhập</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Nhập họ tên"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

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
                disabled={fromProfile} // User không được đổi email (hoặc bạn có thể cho phép)
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
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as 'USER' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="USER">USER</option>
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
                      status: e.target.value as 'Hoạt động' | 'Bị khóa',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bị khóa">Bị khóa</option>
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
            >
              {isEdit ? 'Cập nhật' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}