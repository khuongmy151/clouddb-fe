import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResourceChart from "./components/ResourceChart";
import {
  Clock3,
  Database,
  MemoryStick,
  RefreshCw,
  Users,
  Cpu,
} from "lucide-react";

type DatabaseEngine = "MySQL" | "PostgreSQL" | "SQL Server" | "MongoDB";
type SortKey = "cpu" | "ram" | "storage";
type Period = "1" | "6" | "24";

interface DatabaseResource {
  id: number;
  name: string;
  engine: DatabaseEngine;
  owner: string;
  cpu: number;
  ram: number;
  ramMB: number;
  storage: number;
  storageGB: number;
}

interface ChartData {
  labels: string[];
  cpu: number[];
  ram: number[];
}

const initialDatabases: DatabaseResource[] = [
  {
    id: 1,
    name: "db-mysql-08",
    engine: "MySQL",
    owner: "Nguyễn Văn A",
    cpu: 86,
    ram: 72,
    ramMB: 737,
    storage: 91,
    storageGB: 0.91,
  },
  {
    id: 2,
    name: "db-postgres-03",
    engine: "PostgreSQL",
    owner: "Trần Văn B",
    cpu: 62,
    ram: 58,
    ramMB: 594,
    storage: 44,
    storageGB: 0.44,
  },
  {
    id: 3,
    name: "db-mongo-12",
    engine: "MongoDB",
    owner: "Lê Thị C",
    cpu: 49,
    ram: 88,
    ramMB: 901,
    storage: 73,
    storageGB: 0.73,
  },
  {
    id: 4,
    name: "db-sqlserver-02",
    engine: "SQL Server",
    owner: "Phạm Văn D",
    cpu: 37,
    ram: 65,
    ramMB: 666,
    storage: 57,
    storageGB: 0.57,
  },
  {
    id: 5,
    name: "db-mysql-15",
    engine: "MySQL",
    owner: "Hoàng Thị E",
    cpu: 29,
    ram: 43,
    ramMB: 440,
    storage: 96,
    storageGB: 0.96,
  },
  {
    id: 6,
    name: "db-postgres-07",
    engine: "PostgreSQL",
    owner: "Võ Minh F",
    cpu: 21,
    ram: 34,
    ramMB: 348,
    storage: 28,
    storageGB: 0.28,
  },
];

const initialChartData: Record<Period, ChartData> = {
  "1": {
    labels: ["14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30"],
    cpu: [28, 34, 30, 48, 39, 45, 42],
    ram: [60, 62, 64, 63, 67, 65, 68],
  },
  "6": {
    labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    cpu: [25, 32, 28, 51, 40, 35, 42],
    ram: [51, 55, 57, 60, 62, 65, 68],
  },
  "24": {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    cpu: [18, 23, 31, 46, 40, 35, 42],
    ram: [43, 45, 51, 60, 64, 62, 68],
  },
};

const engineStyles: Record<
  DatabaseEngine,
  { label: string; className: string }
> = {
  MySQL: {
    label: "MY",
    className: "bg-sky-50 text-sky-700",
  },
  PostgreSQL: {
    label: "PG",
    className: "bg-indigo-50 text-indigo-700",
  },
  "SQL Server": {
    label: "SQL",
    className: "bg-rose-50 text-rose-700",
  },
  MongoDB: {
    label: "MG",
    className: "bg-emerald-50 text-emerald-700",
  },
};

function getUsageColor(value: number) {
  if (value >= 85) return "bg-red-500";
  if (value >= 70) return "bg-amber-500";
  return "bg-blue-600";
}

function getUsageTextColor(value: number) {
  if (value >= 85) return "text-red-600";
  if (value >= 70) return "text-amber-600";
  return "text-blue-700";
}

function ResourceBar({
  value,
  detail,
}: {
  value: number;
  detail: string;
}) {
  return (
    <div className="min-w-[135px]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`text-xs font-semibold ${getUsageTextColor(value)}`}>
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${getUsageColor(value)}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <p className="mt-2 whitespace-nowrap text-[11px] text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  iconClass,
  progress,
  progressClass,
  to,
}: {
  title: string;
  value: string | number;
  unit?: string;
  description: React.ReactNode;
  icon: React.ElementType;
  iconClass: string;
  progress?: number;
  progressClass?: string;
  to?: string;
}) {
  const content = (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm ${
        to
          ? "cursor-pointer hover:border-blue-200 hover:bg-slate-50/50"
          : ""
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>

      {progress !== undefined && (
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${progressClass ?? "bg-blue-600"}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      <div className="text-xs leading-5 text-slate-500">{description}</div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

export default function SystemMonitoring() {
  const [cpuUsage, setCpuUsage] = useState(42);
  const [ramUsage, setRamUsage] = useState(68);
  const [totalUsers] = useState(128);
  const [totalDatabases] = useState(46);
  const [databases] = useState(initialDatabases);

  const [sortBy, setSortBy] = useState<SortKey>("cpu");
  const [engineFilter, setEngineFilter] = useState("all");
  const [period, setPeriod] = useState<Period>("1");
  const [chartData, setChartData] = useState(initialChartData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const ramTotalGB = 16;
  const ramUsedGB = ((ramTotalGB * ramUsage) / 100).toFixed(1);

  const filteredDatabases = useMemo(() => {
    return databases
      .filter(
        (database) =>
          engineFilter === "all" || database.engine === engineFilter,
      )
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, 5);
  }, [databases, engineFilter, sortBy]);

  const activeChart = chartData[period];

  function handleRefresh() {
    setIsRefreshing(true);

    const nextCpu = 35 + Math.floor(Math.random() * 16);
    const nextRam = 63 + Math.floor(Math.random() * 8);

    setCpuUsage(nextCpu);
    setRamUsage(nextRam);

    setChartData((previous) => {
      const updated = { ...previous };

      (["1", "6", "24"] as Period[]).forEach((key) => {
        const current = previous[key];

        updated[key] = {
          ...current,
          cpu: current.cpu.map((value, index) =>
            index === current.cpu.length - 1 ? nextCpu : value,
          ),
          ram: current.ram.map((value, index) =>
            index === current.ram.length - 1 ? nextRam : value,
          ),
        };
      });

      return updated;
    });

    setLastUpdated(new Date());
    setIsRefreshing(false);
  }

  const sortOptions: { label: string; value: SortKey }[] = [
    { label: "CPU cao nhất", value: "cpu" },
    { label: "RAM cao nhất", value: "ram" },
    { label: "Ổ cứng cao nhất", value: "storage" },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Giám sát hệ thống
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Theo dõi tài nguyên máy chủ và mức sử dụng database trên toàn hệ
              thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 size={15} />
              <span>
                Cập nhật lúc{" "}
                {lastUpdated.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            title="CPU Laptop"
            value={cpuUsage}
            unit="%"
            icon={Cpu}
            iconClass="bg-blue-50 text-blue-600"
            progress={cpuUsage}
            progressClass="bg-blue-600"
            description="Mức sử dụng CPU toàn máy"
          />

          <MetricCard
            title="RAM Laptop"
            value={ramUsage}
            unit="%"
            icon={MemoryStick}
            iconClass="bg-teal-50 text-teal-700"
            progress={ramUsage}
            progressClass="bg-teal-600"
            description={
              <>
                Đang sử dụng{" "}
                <span className="font-semibold text-slate-700">
                  {ramUsedGB} GB / {ramTotalGB} GB
                </span>
              </>
            }
          />

          {/* Click → trang quản lý người dùng */}
          <MetricCard
            title="Tổng người dùng"
            value={totalUsers}
            unit="người"
            icon={Users}
            iconClass="bg-violet-50 text-violet-700"
            description="Tổng số tài khoản đã đăng ký"
            to="/users"
          />

          {/* Click → trang quản lý database */}
          <MetricCard
            title="Tổng database"
            value={totalDatabases}
            unit="dịch vụ"
            icon={Database}
            iconClass="bg-amber-50 text-amber-700"
            description="Tổng dịch vụ database được cấp phát"
            to="/admin/databasess"
          />
        </div>

        {/* Host resource chart */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Tài nguyên máy chủ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Theo dõi mức sử dụng CPU và RAM của máy chủ
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600">CPU</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                  <span className="text-slate-600">RAM</span>
                </div>
              </div>
            </div>

            {/* Chọn khoảng thời gian */}
            <div className="mb-4 flex gap-2">
              {(["1", "6", "24"] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    period === p
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p === "1" ? "1 giờ" : p === "6" ? "6 giờ" : "24 giờ"}
                </button>
              ))}
            </div>

            <ResourceChart data={activeChart} ramTotalGB={ramTotalGB} />

            <div className="mt-3 flex justify-between gap-3 text-[11px] text-slate-400">
              <span>Đơn vị: % sử dụng</span>
              <span>
                Dữ liệu trong{" "}
                {period === "1"
                  ? "1 giờ"
                  : period === "6"
                    ? "6 giờ"
                    : "24 giờ"}{" "}
                gần đây
              </span>
            </div>
          </div>
        </section>

        {/* Top resource-consuming databases */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Database chiếm dụng tài nguyên nhiều nhất
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Theo dõi mức sử dụng so với hạn mức được cấp cho mỗi dịch vụ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="engineFilter" className="sr-only">
                Lọc theo hệ quản trị database
              </label>
              <select
                id="engineFilter"
                value={engineFilter}
                onChange={(event) => setEngineFilter(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Tất cả hệ quản trị</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="SQL Server">SQL Server</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => {
                const active = sortBy === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-400">
              Sắp xếp giảm dần theo mức sử dụng
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Database
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Người sở hữu
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    CPU
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    RAM
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Ổ cứng
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDatabases.map((database) => {
                  const engine = engineStyles[database.engine];

                  return (
                    <tr
                      key={database.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${engine.className}`}
                          >
                            {engine.label}
                          </div>
                          <div>
                            <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                              {database.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {database.engine}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                          {database.owner}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Chủ sở hữu
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <ResourceBar
                          value={database.cpu}
                          detail={`${(database.cpu * 0.005).toFixed(2)} / 0.5 vCPU`}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <ResourceBar
                          value={database.ram}
                          detail={`${database.ramMB} / 1024 MB`}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <ResourceBar
                          value={database.storage}
                          detail={`${database.storageGB.toFixed(2)} / 1 GB`}
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredDatabases.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-slate-400"
                    >
                      Không có database phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}