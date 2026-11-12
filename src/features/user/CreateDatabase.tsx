import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

type DbType = 'MySQL' | 'PostgreSQL' | 'MongoDB' | 'SQLServer' | '';

const DB_OPTIONS: {
  type: DbType;
  label: string;
  logo: string; // đường dẫn logo
}[] = [
  {
    type: 'MySQL',
    label: 'MySQL',
    logo: '/logos/mysql.png', // ← thay bằng đường dẫn thật của bạn
  },
  {
    type: 'PostgreSQL',
    label: 'PostgreSQL',
    logo: '/logos/postgresql.png',
  },
  {
    type: 'MongoDB',
    label: 'MongoDB',
    logo: '/logos/mongodb.png',
  },
  {
    type: 'SQLServer',
    label: 'SQL Server',
    logo: '/logos/sqlserver.png',
  },
];

export default function CreateDatabase() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<DbType | null>(null);

  const [form, setForm] = useState({
    name: '',
    cpu: '2',
    ram: '4',
    storage: '50',
    version: '',
    backupSchedule: 'Mỗi ngày 1 lần lúc 02:00',
  });

  const handleSelectType = (type: DbType) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (!selectedType) return;

    const defaultVersion =
      selectedType === 'MySQL'
        ? 'MySQL 8.0'
        : selectedType === 'PostgreSQL'
        ? 'PostgreSQL 17.1'
        : selectedType === 'MongoDB'
        ? 'MongoDB 7.0'
        : 'SQL Server 2022';

    setForm((prev) => ({ ...prev, version: defaultVersion }));
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API tạo DB
    console.log({ type: selectedType, ...form });
    navigate('/databases');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 1 ? 'Chọn loại DB' : 'Cấu hình database'}
          </h2>
          <button
            onClick={() => navigate('/databases')}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== BƯỚC 1: Chọn loại ===== */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DB_OPTIONS.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleSelectType(opt.type)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={opt.logo}
                      alt={opt.label}
                      className="w-12 h-12 object-contain"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/databases')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedType}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* ===== BƯỚC 2: Cấu hình ===== */}
        {step === 2 && selectedType && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="font-medium text-gray-800">{selectedType}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:underline text-xs"
              >
                (Đổi loại)
              </button>
            </div>

          {/* ===== Cấu hình (chọn plan giống bảng) ===== */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    Cấu hình
  </label>

  <div className="overflow-hidden rounded-xl border border-gray-200">
    {/* Header */}
    <div className="grid grid-cols-[40px_1fr_1fr_1fr] bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="px-4 py-3"></div>
      <div className="px-4 py-3">CPU (vCPU)</div>
      <div className="px-4 py-3">RAM (GB)</div>
      <div className="px-4 py-3">Ổ (GB)</div>
    </div>

    {/* Options */}
    {[
      { cpu: '1', ram: '4', storage: '80' },
      { cpu: '2', ram: '8', storage: '175' },
      { cpu: '4', ram: '16', storage: '350' },
      { cpu: '8', ram: '32', storage: '700' },
    ].map((plan) => {
      const isSelected =
        form.cpu === plan.cpu &&
        form.ram === plan.ram &&
        form.storage === plan.storage;

      return (
        <label
          key={`${plan.cpu}-${plan.ram}-${plan.storage}`}
          className={`grid grid-cols-[40px_1fr_1fr_1fr] items-center cursor-pointer border-t border-gray-100 transition-colors ${
            isSelected
              ? 'bg-emerald-950/5 text-gray-900'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="px-4 py-3.5 flex justify-center">
            <input
              type="radio"
              name="config-plan"
              checked={isSelected}
              onChange={() =>
                setForm({
                  ...form,
                  cpu: plan.cpu,
                  ram: plan.ram,
                  storage: plan.storage,
                })
              }
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>
          <div className="px-4 py-3.5 text-sm font-medium">{plan.cpu}</div>
          <div className="px-4 py-3.5 text-sm font-medium">{plan.ram} GB</div>
          <div className="px-4 py-3.5 text-sm font-medium">{plan.storage} GB</div>
        </label>
      );
    })}
  </div>
</div>

            {/* Tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên database <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: db_shop, analytics_pg..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Phiên bản */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phiên bản
              </label>
              <select
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedType === 'MySQL' && (
                  <>
                    <option value="MySQL 8.0">MySQL 8.0 (mới nhất)</option>
                    <option value="MySQL 5.7">MySQL 5.7</option>
                  </>
                )}
                {selectedType === 'PostgreSQL' && (
                  <>
                    <option value="PostgreSQL 17.1">PostgreSQL 17.1 (mới nhất)</option>
                    <option value="PostgreSQL 16">PostgreSQL 16</option>
                    <option value="PostgreSQL 15">PostgreSQL 15</option>
                  </>
                )}
                {selectedType === 'MongoDB' && (
                  <>
                    <option value="MongoDB 7.0">MongoDB 7.0 (mới nhất)</option>
                    <option value="MongoDB 6.0">MongoDB 6.0</option>
                  </>
                )}
                {selectedType === 'SQLServer' && (
                  <>
                    <option value="SQL Server 2022">SQL Server 2022 (mới nhất)</option>
                    <option value="SQL Server 2019">SQL Server 2019</option>
                  </>
                )}
              </select>
            </div>

           
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
              >
                Tạo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}