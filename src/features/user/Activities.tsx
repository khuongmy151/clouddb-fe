import { useState } from 'react';
import { mockActivities } from '../../data/mock';

export default function Activities() {
  const [search, setSearch] = useState('');
  const activities = mockActivities;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Nhật ký hoạt động</h1>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Tìm theo người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          <option>Tất cả hành động</option>
          <option>LOGIN</option>
          <option>CREATE_DB</option>
          <option>BACKUP</option>
          <option>DELETE_USER</option>
          <option>UPDATE_PROFILE</option>
        </select>
        <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
        <span className="text-gray-400">→</span>
        <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
        <button className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">
          Lọc
        </button>
      </div>

      {/* Bảng nhật ký */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Hành động</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Mô tả</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{a.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{a.user}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {a.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{a.description}</td>
                <td className="px-4 py-3 text-gray-500">{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          Hiển thị 1 - 5 / 50
        </div>
      </div>
    </div>
  );
}