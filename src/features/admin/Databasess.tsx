import { useMemo, useState } from "react";
import {
  Database,
  Search,
  Filter,
  HardDrive,
  Cpu,
} from "lucide-react";

type DatabaseEngine = "MySQL" | "PostgreSQL" | "SQL Server" | "MongoDB";

interface DatabaseItem {
  id: number;
  name: string;
  engine: DatabaseEngine;
  owner: string;
  status: "running" | "stopped";
  cpu: number;
  ram: number;
  storage: number;
  createdAt: string;
}

const mockDatabases: DatabaseItem[] = [
  {
    id: 1,
    name: "db-mysql-08",
    engine: "MySQL",
    owner: "Nguyễn Văn A",
    status: "running",
    cpu: 86,
    ram: 72,
    storage: 91,
    createdAt: "2026-08-12",
  },
  {
    id: 2,
    name: "db-postgres-03",
    engine: "PostgreSQL",
    owner: "Trần Văn B",
    status: "running",
    cpu: 62,
    ram: 58,
    storage: 44,
    createdAt: "2026-07-28",
  },
  {
    id: 3,
    name: "db-mongo-12",
    engine: "MongoDB",
    owner: "Lê Thị C",
    status: "running",
    cpu: 49,
    ram: 88,
    storage: 73,
    createdAt: "2026-09-05",
  },
  {
    id: 4,
    name: "db-sqlserver-02",
    engine: "SQL Server",
    owner: "Phạm Văn D",
    status: "stopped",
    cpu: 0,
    ram: 12,
    storage: 57,
    createdAt: "2026-06-15",
  },
  {
    id: 5,
    name: "db-mysql-15",
    engine: "MySQL",
    owner: "Hoàng Thị E",
    status: "running",
    cpu: 29,
    ram: 43,
    storage: 96,
    createdAt: "2026-10-01",
  },
  {
    id: 6,
    name: "db-postgres-07",
    engine: "PostgreSQL",
    owner: "Võ Minh F",
    status: "running",
    cpu: 5,
    ram: 8,
    storage: 28,
    createdAt: "2026-09-20",
  },
];

const engineStyles: Record<DatabaseEngine, string> = {
  MySQL: "bg-sky-50 text-sky-700",
  PostgreSQL: "bg-indigo-50 text-indigo-700",
  "SQL Server": "bg-rose-50 text-rose-700",
  MongoDB: "bg-emerald-50 text-emerald-700",
};

const statusStyles = {
  running: "bg-emerald-50 text-emerald-700",
  stopped: "bg-slate-100 text-slate-600",
  error: "bg-red-50 text-red-700",
};

const statusLabels = {
  running: "Đang chạy",
  stopped: "Đã dừng",
};

export default function Databases() {
  const [search, setSearch] = useState("");
  const [engineFilter, setEngineFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockDatabases.filter((db) => {
      const matchSearch =
        db.name.toLowerCase().includes(search.toLowerCase()) ||
        db.owner.toLowerCase().includes(search.toLowerCase());

      const matchEngine =
        engineFilter === "all" || db.engine === engineFilter;

      const matchStatus =
        statusFilter === "all" || db.status === statusFilter;

      return matchSearch && matchEngine && matchStatus;
    });
  }, [search, engineFilter, statusFilter]);

  const hasActiveFilter =
    search !== "" || engineFilter !== "all" || statusFilter !== "all";

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Quản lý Database
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Danh sách các dịch vụ database đã được cấp phát trên hệ thống
          </p>
        </div>

        {/* Stats nhanh */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Tổng database</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockDatabases.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Cpu size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Đang chạy</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockDatabases.filter((d) => d.status === "running").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Đã dừng </p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    mockDatabases.filter(
                      (d) => d.status === "stopped",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter + Search */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm theo tên database hoặc chủ sở hữu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Lọc trạng thái */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="running">Đang chạy</option>
                <option value="stopped">Đã dừng</option>
              </select>
            </div>

            {/* Lọc hệ quản trị */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả hệ quản trị</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="SQL Server">SQL Server</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>

            {hasActiveFilter && (
              <button
                onClick={() => {
                  setSearch("");
                  setEngineFilter("all");
                  setStatusFilter("all");
                }}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Số lượng kết quả */}
        <p className="mb-3 text-sm text-slate-500">
          Hiển thị{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          / {mockDatabases.length} database
        </p>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Database
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Chủ sở hữu
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    CPU
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    RAM
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Storage
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Ngày tạo
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((db) => (
                  <tr
                    key={db.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${engineStyles[db.engine]}`}
                        >
                          {db.engine === "MySQL"
                            ? "MY"
                            : db.engine === "PostgreSQL"
                              ? "PG"
                              : db.engine === "SQL Server"
                                ? "SQL"
                                : "MG"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {db.name}
                          </p>
                          <p className="text-xs text-slate-400">{db.engine}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {db.owner}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[db.status]}`}
                      >
                        {statusLabels[db.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {db.cpu}%
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {db.ram}%
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {db.storage}%
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {db.createdAt}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-sm text-slate-400"
                    >
                      Không tìm thấy database phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}