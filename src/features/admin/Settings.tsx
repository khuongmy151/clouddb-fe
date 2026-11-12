import { useState } from 'react';
import { Save, Shield, Database, Plus, Trash2 } from 'lucide-react';

type DbType = 'MySQL' | 'PostgreSQL' | 'SQLServer' | 'MongoDB';

interface DbConfig {
  autoBackup: boolean;
  backupTime: string;
  retentionDays: number;
}

interface PlanConfig {
  id: string;
  cpu: number;      // vCPU
  ram: number;      // GB
  storage: number;  // GB
}

const defaultConfigs: Record<DbType, DbConfig> = {
  MySQL: {
    autoBackup: true,
    backupTime: '02:00',
    retentionDays: 7,
  },
  PostgreSQL: {
    autoBackup: true,
    backupTime: '02:30',
    retentionDays: 14,
  },
  SQLServer: {
    autoBackup: true,
    backupTime: '03:00',
    retentionDays: 14,
  },
  MongoDB: {
    autoBackup: true,
    backupTime: '03:30',
    retentionDays: 7,
  },
};

const defaultPlans: PlanConfig[] = [
  { id: '1', cpu: 1, ram: 4, storage: 80 },
  { id: '2', cpu: 2, ram: 8, storage: 175 },
  { id: '3', cpu: 4, ram: 16, storage: 350 },
  { id: '4', cpu: 8, ram: 32, storage: 700 },
];

export default function Settings() {
  // Giả lập quyền Admin – thực tế lấy từ auth context
  const [isAdmin] = useState(true); // đổi thành false để test quyền user

  const [activeTab, setActiveTab] = useState<'security' | 'database'>('security');

  // ===== Bảo mật =====
  const [security, setSecurity] = useState({
    minPasswordLength: 8,
    requireSpecialChar: true,
    sessionTimeout: 30,
  });

  // ===== Database =====
  const [selectedDb, setSelectedDb] = useState<DbType>('MySQL');
  const [dbConfigs, setDbConfigs] = useState<Record<DbType, DbConfig>>(defaultConfigs);

  // ===== Cấu hình gói (CPU / RAM / Ổ) =====
  const [plans, setPlans] = useState<PlanConfig[]>(defaultPlans);

  const currentConfig = dbConfigs[selectedDb];

  const updateCurrentConfig = (key: keyof DbConfig, value: any) => {
    setDbConfigs((prev) => ({
      ...prev,
      [selectedDb]: {
        ...prev[selectedDb],
        [key]: value,
      },
    }));
  };

  const updatePlan = (id: string, field: keyof Omit<PlanConfig, 'id'>, value: number) => {
    if (!isAdmin) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addPlan = () => {
    if (!isAdmin) return;
    const newId = Date.now().toString();
    setPlans((prev) => [
      ...prev,
      { id: newId, cpu: 1, ram: 4, storage: 50 },
    ]);
  };

  const removePlan = (id: string) => {
    if (!isAdmin) return;
    if (plans.length <= 1) {
      alert('Phải giữ lại ít nhất 1 cấu hình');
      return;
    }
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    // TODO: Gọi API lưu
    console.log({
      security,
      dbConfigs,
      plans: isAdmin ? plans : undefined,
    });
    alert('Đã lưu cài đặt thành công!');
  };

  const tabs = [
    { id: 'security' as const, label: 'Bảo mật', icon: Shield },
    { id: 'database' as const, label: 'Database', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm"
        >
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {/* ===== TAB BẢO MẬT ===== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt bảo mật</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ dài mật khẩu tối thiểu
                </label>
                <input
                  type="number"
                  min={6}
                  max={32}
                  value={security.minPasswordLength}
                  onChange={(e) =>
                    setSecurity({ ...security, minPasswordLength: Number(e.target.value) })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.requireSpecialChar}
                  onChange={(e) =>
                    setSecurity({ ...security, requireSpecialChar: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Bắt buộc có ký tự đặc biệt trong mật khẩu
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hết phiên (phút)
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={security.sessionTimeout}
                  onChange={(e) =>
                    setSecurity({ ...security, sessionTimeout: Number(e.target.value) })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Người dùng sẽ bị đăng xuất sau khoảng thời gian này nếu không hoạt động
                </p>
              </div>
            </div>
          )}

          {/* ===== TAB DATABASE ===== */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cấu hình mặc định theo loại Database
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Thiết lập lịch sao lưu, thời gian giữ backup và các gói cấu hình cho database.
                </p>
              </div>

              {/* Chọn loại DB */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(defaultConfigs) as DbType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedDb(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedDb === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Form cấu hình cho loại đang chọn */}
              <div className="border border-gray-200 rounded-xl p-5 space-y-5 bg-gray-50/50">
                <h3 className="font-medium text-gray-900">
                  Cấu hình cho <span className="text-blue-600">{selectedDb}</span>
                </h3>

                {/* Sao lưu */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentConfig.autoBackup}
                    onChange={(e) =>
                      updateCurrentConfig('autoBackup', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Tự động sao lưu hàng ngày</span>
                </label>

                {currentConfig.autoBackup && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ sao lưu tự động
                      </label>
                      <input
                        type="time"
                        value={currentConfig.backupTime}
                        onChange={(e) =>
                          updateCurrentConfig('backupTime', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số ngày giữ bản sao lưu
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={currentConfig.retentionDays}
                        onChange={(e) =>
                          updateCurrentConfig('retentionDays', Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Bản sao lưu cũ hơn sẽ tự động bị xóa
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== CẤU HÌNH GÓI (CPU / RAM / Ổ) ===== */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Cấu hình gói</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Các gói CPU / RAM / Ổ cứng hiển thị khi người dùng tạo database.
                      {isAdmin ? (
                        <span className="text-emerald-600 font-medium"> Bạn đang ở chế độ Admin – có thể chỉnh sửa.</span>
                      ) : (
                        <span className="text-amber-600 font-medium"> Chỉ Admin mới được thay đổi.</span>
                      )}
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={addPlan}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm gói
                    </button>
                  )}
                </div>

                {/* Bảng cấu hình */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_1fr_1fr_48px] bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="px-4 py-3">CPU (vCPU)</div>
                    <div className="px-4 py-3">RAM (GB)</div>
                    <div className="px-4 py-3">Ổ (GB)</div>
                    <div className="px-2 py-3"></div>
                  </div>

                  {/* Rows */}
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="grid grid-cols-[1fr_1fr_1fr_48px] items-center border-t border-gray-100 hover:bg-gray-50/50"
                    >
                      {/* CPU */}
                      <div className="px-4 py-3">
                        {isAdmin ? (
                          <input
                            type="number"
                            min={1}
                            max={64}
                            value={plan.cpu}
                            onChange={(e) =>
                              updatePlan(plan.id, 'cpu', Number(e.target.value))
                            }
                            className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-800">{plan.cpu}</span>
                        )}
                      </div>

                      {/* RAM */}
                      <div className="px-4 py-3">
                        {isAdmin ? (
                          <input
                            type="number"
                            min={1}
                            max={256}
                            value={plan.ram}
                            onChange={(e) =>
                              updatePlan(plan.id, 'ram', Number(e.target.value))
                            }
                            className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-800">{plan.ram} GB</span>
                        )}
                      </div>

                      {/* Storage */}
                      <div className="px-4 py-3">
                        {isAdmin ? (
                          <input
                            type="number"
                            min={10}
                            max={2000}
                            value={plan.storage}
                            onChange={(e) =>
                              updatePlan(plan.id, 'storage', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-800">{plan.storage} GB</span>
                        )}
                      </div>

                      {/* Xóa */}
                      <div className="px-2 py-3 flex justify-center">
                        {isAdmin && (
                          <button
                            onClick={() => removePlan(plan.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                            title="Xóa gói"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {!isAdmin && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
                    Bạn không có quyền chỉnh sửa cấu hình gói. Vui lòng liên hệ Admin nếu cần thay đổi.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}