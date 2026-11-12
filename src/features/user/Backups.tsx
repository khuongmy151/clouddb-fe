import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Plus, RotateCcw, Eye } from 'lucide-react';
import { mockBackups } from '../../data/mock';

export default function Backups() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const backups = mockBackups;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/databases/${id}`} className="text-sm text-blue-600 hover:underline">
            ← Quay lại database
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Danh sách bản sao lưu – db_shop
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          <Plus className="w-4 h-4" />
          Tạo bản sao lưu
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm backup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng backup */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Tên backup</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Kích thước</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {backups.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{b.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                <td className="px-4 py-3 text-gray-600">{b.size}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      b.status === 'Hoàn tất'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{b.time}</td>
                <td className="px-4 py-3">
                  {b.status === 'Hoàn tất' ? (
                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Phục hồi
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded hover:bg-gray-100">
                      <Eye className="w-3.5 h-3.5" />
                      Xem log
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}