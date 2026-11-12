import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Database, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi } from './api/authApi';
import { useAuth } from './AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading, setUser } = useAuth(); // 🔥 lấy thêm loading + user
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Nếu đã login rồi thì không cho vào trang login nữa
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/databasess' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authApi.login({
        usernameOrEmail: form.username.trim(),
        password: form.password,
      });

      setUser(data); // 🔥 cookie đã được BE set, chỉ cần lưu user vào context

      // 🔥 Điều hướng theo role
      navigate(data.role === 'ADMIN' ? '/admin/databasess' : '/dashboard', { replace: true });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Bên trái - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex-col justify-center items-center p-12">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center">
              <Database className="w-12 h-12 text-blue-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Hệ thống tự động cấp phát<br />và quản lý cơ sở dữ liệu
          </h1>
          <p className="text-slate-300 text-lg">
            Quản lý database an toàn · Hiệu quả · Linh hoạt
          </p>
        </div>
      </div>

      {/* Bên phải - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-gray-500 mb-8">Chào mừng bạn quay trở lại hệ thống</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Nhập tên đăng nhập hoặc email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}