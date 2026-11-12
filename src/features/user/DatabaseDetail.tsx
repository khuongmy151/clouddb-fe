import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DeleteDatabaseModal from './components/DeleteDatabaseModal';
import RestoreBackupModal from './components/RestoreBackupModal';
import CpuUsageChart from './components/CpuUsageChart';
import DatabaseLogs from './components/DatabaseLogs';
import {
  ArrowLeft,
  Play,
  Square,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Database as DatabaseIcon,
} from 'lucide-react';
import { mockDatabases } from '../../data/mock';

export default function DatabaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = mockDatabases.find((d) => d.id === Number(id)) || mockDatabases[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'log' | 'backup'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(db.status);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State cho modal phục hồi
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<{
    id: number;
    file_name: string;
  } | null>(null);

  const toggleStatus = () => {
    setStatus((prev) => (prev === 'Running' ? 'Stopped' : 'Running'));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRestore = (backupId: number, fileName: string) => {
    setSelectedBackup({ id: backupId, file_name: fileName });
    setShowRestoreModal(true);
  };

  // Fake log lines
  const logs = [
    '[2025-10-20 14:32:01] INFO  Connection established from 113.161.x.x',
    '[2025-10-20 14:32:05] INFO  Query executed: SELECT * FROM users LIMIT 10',
    '[2025-10-20 14:33:12] WARN  Slow query detected (1.2s)',
    '[2025-10-20 14:35:00] INFO  Backup started',
    '[2025-10-20 14:36:45] INFO  Backup completed successfully',
    '[2025-10-20 14:40:22] INFO  Connection closed',
  ];

  // Mock danh sách backup
  const backups = [
    {
      id: 1,
      file_name: `${db.name}_2025-10-28_023015.sql.gz`,
      file_size_mb: 124.5,
      status: 'SUCCESS',
      created_at: '2025-10-28 02:30:15',
    },
    {
      id: 2,
      file_name: `${db.name}_2025-10-25_023012.sql.gz`,
      file_size_mb: 118.2,
      status: 'SUCCESS',
      created_at: '2025-10-25 02:30:12',
    },
    {
      id: 3,
      file_name: `${db.name}_2025-10-22_023008.sql.gz`,
      file_size_mb: 0,
      status: 'FAILED',
      created_at: '2025-10-22 02:30:08',
    },
    {
      id: 4,
      file_name: `${db.name}_2025-10-19_023005.sql.gz`,
      file_size_mb: 105.8,
      status: 'SUCCESS',
      created_at: '2025-10-19 02:30:05',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link
        to="/databases"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={
                  db.type === 'MySQL'
                    ? '/logos/mysql.png'
                    : db.type === 'PostgreSQL'
                      ? '/logos/postgresql.png'
                      : db.type === 'MongoDB'
                        ? '/logos/mongodb.png'
                        : '/logos/sqlserver.png'
                }
                alt={db.type}
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">{db.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{db.version || db.type}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    status === 'Running'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === 'Running' ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  {status === 'Running' ? 'Running' : 'Powered off'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleStatus}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              status === 'Running'
                ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {status === 'Running' ? (
              <>
                <Square className="w-4 h-4" /> Dừng DB
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Chạy DB
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'log'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Log
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'backup'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Backup
            </button>
          </div>
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin kết nối</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Host', value: db.host || 'localhost' },
                  { label: 'Port', value: String(db.port || 3306) },
                  { label: 'Username', value: db.username || `${db.name}_user` },
                  {
                    label: 'Password',
                    value: showPassword ? 'P@ssw0rd123!' : '••••••••••••',
                    isPassword: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{item.value}</p>
                        {item.isPassword && (
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            copyToClipboard(item.isPassword ? 'P@ssw0rd123!' : item.value)
                          }
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Sử dụng</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">Service plan usage</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Memory used (80%)</span>
                      <span>3.2 / 4 GB</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>CPU (45%)</span>
                      <span>0.9 / 2 vCPU</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Storage used (62%)</span>
                      <span>31 / 50 GB</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>
                </div>

                <CpuUsageChart />
              </div>
            </div>
          </div>
        )}

        {/* ===== LOG ===== */}
        {activeTab === 'log' && <DatabaseLogs logs={logs} />}

        {/* ===== BACKUP ===== */}
        {activeTab === 'backup' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Danh sách Backup</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Các bản sao lưu tự động của database
                </p>
              </div>
              
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Tên file</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Dung lượng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                        {backup.created_at}
                      </td>
                      <td className="px-4 py-3.5 text-gray-900 font-medium">
                        {backup.file_name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {backup.status === 'SUCCESS'
                          ? `${backup.file_size_mb.toFixed(1)} MB`
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            backup.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {backup.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {backup.status === 'SUCCESS' && (
                            <>
                              <button
                                onClick={() => handleRestore(backup.id, backup.file_name)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Phục hồi
                              </button>
                              <button
                                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                title="Tải xuống"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {backups.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                Chưa có bản backup nào
              </div>
            )}
          </div>
        )}
      </div>

      {/* Khu vực xóa */}
      <section className="mt-8 border-t border-red-200 pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa database
          </button>
        </div>
      </section>

      {/* Modal Xóa Database */}
      <DeleteDatabaseModal
        isOpen={showDeleteModal}
        databaseName={db.name}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          navigate('/databases');
        }}
      />

      {/* Modal Phục hồi Backup */}
      <RestoreBackupModal
        isOpen={showRestoreModal}
        databaseName={db.name}
        backupFileName={selectedBackup?.file_name || ''}
        onCancel={() => {
          setShowRestoreModal(false);
          setSelectedBackup(null);
        }}
        onConfirm={() => {
          // TODO: gọi API phục hồi thật
          console.log('Restoring backup:', selectedBackup);
          setShowRestoreModal(false);
          setSelectedBackup(null);
        }}
      />
    </div>
  );
}