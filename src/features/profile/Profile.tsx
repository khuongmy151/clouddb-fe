import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Pencil,
  CheckCircle,
  Key,
  Mail,
  User as UserIcon,
  Clock,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { profileApi, type UserProfile } from './api/profileApi';
import { formatDateTime } from '../../core/utils/date';
import { useAuth } from '../auth/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'security'>('basic');

  // State form đổi mật khẩu
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getMyProfile();
        setUser(res.data);
      } catch (error) {
        console.error('Lỗi lấy thông tin cá nhân', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setIsSubmitting(true);
    try {
      await profileApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Thông báo thành công
      setMessage({
        type: 'success',
        text: 'Đổi mật khẩu thành công! Đang đăng xuất...',
      });

      // Đợi 1.5s để người dùng đọc thông báo rồi đăng xuất
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.',
      });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        Không thể tải thông tin cá nhân.
      </div>
    );
  }

  const avatarLetter = user.fullname
    ? user.fullname.charAt(0)
    : user.username.charAt(0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarLetter.toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {user.fullname || user.username}
              </h2>
              <p className="text-blue-100">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-500/30 rounded text-xs">
                <CheckCircle className="w-3 h-3" />
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị chặn'}
              </span>
            </div>
            <Link
              to="/profile/edit"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition"
            >
              <Pencil className="w-4 h-4" />
              Chỉnh sửa
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'basic'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'security'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Bảo mật
            </button>
          </div>
        </div>

        {/* ===== TAB Thông tin cơ bản ===== */}
        {activeTab === 'basic' && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" /> Tên đăng nhập
              </p>
              <p className="font-medium text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
              <p className="font-medium text-gray-900">
                {user.fullname || 'Chưa cập nhật'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{user.email}</p>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Đã xác minh
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Ngày tạo
              </p>
              <p className="font-medium text-gray-900">
                {formatDateTime(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Vai trò</p>
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  user.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị chặn'}
              </span>
            </div>
          </div>
        )}

        {/* ===== TAB Bảo mật ===== */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Mật khẩu</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Đổi mật khẩu sẽ đăng xuất bạn khỏi tất cả các thiết bị.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setMessage(null);
                }}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 disabled:opacity-50"
              >
                {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
              </button>
            </div>

            {/* Form đổi mật khẩu */}
            {showPasswordForm && (
              <form
                onSubmit={handleChangePassword}
                className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50"
              >
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

                {/* Mật khẩu hiện tại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Nhập mật khẩu hiện tại"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ít nhất 6 ký tự"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {isSubmitting ? 'Đang xử lý...' : 'Lưu mật khẩu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}