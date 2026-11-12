import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });

  // Kiểm tra điều kiện mật khẩu mạnh
  const requirements = [
    { label: 'Tối thiểu 8 ký tự', ok: form.newPass.length >= 8 },
    { label: 'Có chữ hoa, chữ thường', ok: /[a-z]/.test(form.newPass) && /[A-Z]/.test(form.newPass) },
    { label: 'Có số và ký tự đặc biệt', ok: /\d/.test(form.newPass) && /[^a-zA-Z0-9]/.test(form.newPass) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tạm thời chưa gọi API
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu hiện tại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={show.current ? 'text' : 'password'}
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, current: !show.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={show.new ? 'text' : 'password'}
                value={form.newPass}
                onChange={(e) => setForm({ ...form, newPass: e.target.value })}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, new: !show.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={show.confirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Danh sách điều kiện mật khẩu */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-xs font-medium text-gray-600 mb-2">Mật khẩu phải có:</p>
            {requirements.map((r) => (
              <div key={r.label} className="flex items-center gap-2 text-xs">
                <Check className={`w-3.5 h-3.5 ${r.ok ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span className={r.ok ? 'text-emerald-700' : 'text-gray-500'}>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Nút */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}