import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true); // Giả lập đã gửi email
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Quên mật khẩu</h2>
          <p className="text-sm text-gray-500 mt-2">
            Vui lòng nhập email của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
          </p>
        </div>

        {sent ? (
          // Sau khi gửi thành công
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
              <Send className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-700">
              Kiểm tra email của bạn. Link đặt lại mật khẩu sẽ được gửi trong 5 phút.
            </p>
            <Link to="/login" className="inline-block text-sm text-blue-600 hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          // Form nhập email
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Gửi liên kết
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}