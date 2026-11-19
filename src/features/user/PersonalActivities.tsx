import { useEffect, useState } from 'react';
import { formatDateTime } from '../../core/utils/date';
import {
  myActivityApi,
  type ActivityLogResponse,
  type ActionType,
} from './api/activityApi';

const ACTION_LABELS: Record<ActionType, string> = {
  CREATE_USER: 'Tạo người dùng',
  UPDATE_USER: 'Cập nhật người dùng',
  DELETE_USER: 'Xóa người dùng',
  BAN_USER: 'Khóa người dùng',
  UNBAN_USER: 'Mở khóa người dùng',
  CHANGE_PASSWORD: 'Đổi mật khẩu',
  LOGIN: 'Đăng nhập',
  LOGOUT: 'Đăng xuất',
  CREATE_DB: 'Tạo CSDL',
  UPDATE_DB: 'Cập nhật CSDL',
  DELETE_DB: 'Xóa CSDL',
  START_DB: 'Khởi động CSDL',
  STOP_DB: 'Dừng CSDL',
  BACKUP_DB: 'Sao lưu CSDL',
  RESTORE_DB: 'Phục hồi CSDL',
  ASSIGN_ROLE: 'Gán quyền',
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'bg-green-100 text-green-700',
  LOGOUT: 'bg-gray-100 text-gray-700',
  CREATE_DB: 'bg-blue-100 text-blue-700',
  UPDATE_DB: 'bg-yellow-100 text-yellow-700',
  DELETE_DB: 'bg-red-100 text-red-700',
  BACKUP_DB: 'bg-purple-100 text-purple-700',
  RESTORE_DB: 'bg-indigo-100 text-indigo-700',
  CHANGE_PASSWORD: 'bg-orange-100 text-orange-700',
  UPDATE_USER: 'bg-yellow-100 text-yellow-700',
};

// Chỉ hiển thị các action mà user thường có thể tạo ra
const USER_ACTIONS: ActionType[] = [
  'LOGIN',
  'LOGOUT',
  'CHANGE_PASSWORD',
  'UPDATE_USER',
  'CREATE_DB',
  'UPDATE_DB',
  'DELETE_DB',
  'START_DB',
  'STOP_DB',
  'BACKUP_DB',
  'RESTORE_DB',
];

const PAGE_SIZE = 10;

type SortBy = 'id' | 'createdAt';
type SortDir = 'ASC' | 'DESC';

export default function PersonalActivities() {
  const [actionType, setActionType] = useState<ActionType | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);

  // Mặc định sắp xếp ID tăng dần (giống admin)
  const [sortBy, setSortBy] = useState<SortBy>('id');
  const [sortDir, setSortDir] = useState<SortDir>('DESC');

  const [logs, setLogs] = useState<ActivityLogResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (
    pageToFetch = page,
    overrides?: { sortBy?: SortBy; sortDir?: SortDir }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await myActivityApi.getMyLogs({
        actionType: actionType || undefined,
        page: pageToFetch,
        size: PAGE_SIZE,
        sortBy: overrides?.sortBy ?? sortBy,
        sortDir: overrides?.sortDir ?? sortDir,
      });
      setLogs(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không tải được nhật ký hoạt động');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0);
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    setPage(0);
    fetchLogs(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
    fetchLogs(newPage);
  };

  const handleSortChange = (value: string) => {
    const [by, dir] = value.split('-') as [SortBy, SortDir];
    setSortBy(by);
    setSortDir(dir);
    setPage(0);
    fetchLogs(0, { sortBy: by, sortDir: dir });
  };

  // Lọc client-side theo khoảng ngày (backend chưa hỗ trợ filter theo ngày)
  const filteredLogs = logs.filter((log) => {
    if (!fromDate && !toDate) return true;
    const logDate = new Date(log.createdAt);
    if (fromDate && logDate < new Date(fromDate)) return false;
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (logDate > to) return false;
    }
    return true;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN');
  };

  const startIdx = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endIdx = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Nhật ký của bản thân</h1>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value as ActionType | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Tất cả hành động</option>
          {USER_ACTIONS.map((key) => (
            <option key={key} value={key}>
              {ACTION_LABELS[key]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        />
        <span className="text-gray-400">→</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        />

        <select
          value={`${sortBy}-${sortDir}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
          title="Sắp xếp"
        >
          <option value="id-ASC">ID tăng dần</option>
          <option value="id-DESC">ID giảm dần</option>
          <option value="createdAt-DESC">Mới nhất trước</option>
          <option value="createdAt-ASC">Cũ nhất trước</option>
        </select>

        <button
          onClick={handleFilter}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang tải...' : 'Lọc'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Bảng */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Hành động</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Mô tả</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Đối tượng</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!loading && filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Không có bản ghi nào
                </td>
              </tr>
            )}
            {!loading &&
              filteredLogs.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{a.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        ACTION_COLORS[a.actionType] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ACTION_LABELS[a.actionType] || a.actionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.description}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.targetUsername || (a.targetDb ? `DB #${a.targetDb}` : '—')}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(a.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Footer + phân trang */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>
            {totalElements === 0
              ? 'Hiển thị 0 bản ghi'
              : `Hiển thị ${startIdx} - ${endIdx} / ${totalElements}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0 || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              ← Trước
            </button>
            <span className="px-2">
              Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}