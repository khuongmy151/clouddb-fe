import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Play, Square } from 'lucide-react';
import { mockDatabases } from '../../data/mock';
import type { Database } from '../../types';

export default function Databases() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dbs, setDbs] = useState<Database[]>(mockDatabases);

  const filtered = dbs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || d.type === filterType;
    return matchSearch && matchType;
  });

  const handleToggleStatus = (id: number) => {
    setDbs((prev) =>
      prev.map((db) =>
        db.id === id
          ? { ...db, status: db.status === 'Running' ? 'Stopped' : 'Running' }
          : db
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Database</h1>
        <Link
          to="/databases/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo DB
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Lọc:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả</option>
            <option value="MySQL">MySQL</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MongoDB">MongoDB</option>
            <option value="SQL Server">SQL Server</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Loại DB</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Tên DB</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Cấu hình</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Ngày tạo</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Chức năng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    Không tìm thấy database nào
                  </td>
                </tr>
              ) : (
                filtered.map((db) => (
                  <tr key={db.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-700">{db.type}</td>
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/databases/${db.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {db.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {db.cpu} / {db.ram} / {db.storage}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{db.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {db.status === 'Running' ? (
                          <button
                            onClick={() => handleToggleStatus(db.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md"
                          >
                            <Square className="w-3.5 h-3.5" />
                            Dừng DB
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(db.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Chạy DB
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>
            Hiển thị {filtered.length} / {dbs.length}
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              « Trước
            </button>
            <span className="px-2">Trang 1 / 1</span>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Sau »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}