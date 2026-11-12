import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  labels: string[];
  cpu: number[];
  ram: number[];
};

type ChartPoint = {
  time: string;
  cpu: number;
  ram: number;
};

type ResourceChartProps = {
  data: ChartData;
  ramTotalGB?: number;
};

type TooltipPayloadItem = {
  dataKey?: string | number;
  value?: number | string;
  payload?: ChartPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: readonly TooltipPayloadItem[];
  label?: string | number;
  ramTotalGB: number;
};

function CustomTooltip({
  active,
  payload,
  label,
  ramTotalGB,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  if (!point) return null;

  const ramUsedGB = (point.ram / 100) * ramTotalGB;

  return (
    <div className="min-w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-3 text-xs font-medium text-slate-500">
        {label ?? point.time}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-600">CPU Laptop</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {point.cpu.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            <span className="text-sm text-slate-600">RAM Laptop</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {point.ram.toFixed(1)}%
          </span>
        </div>

        <div className="border-t border-slate-100 pt-2">
          <p className="text-xs text-slate-500">RAM đã sử dụng (ước tính)</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {ramUsedGB.toFixed(2)} / {ramTotalGB} GB
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResourceChart({
  data,
  ramTotalGB = 16,
}: ResourceChartProps) {
  const chartData: ChartPoint[] = data.labels.map((time, index) => ({
    time,
    cpu: data.cpu[index] ?? 0,
    ram: data.ram[index] ?? 0,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
        >
          <CartesianGrid
            stroke="#e8edf5"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={12}
            minTickGap={24}
          />

          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={42}
          />

          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                payload={props.payload as readonly TooltipPayloadItem[] | undefined}
                label={props.label}
                ramTotalGB={ramTotalGB}
              />
            )}
            cursor={{
              stroke: "#94a3b8",
              strokeDasharray: "4 4",
              strokeWidth: 1,
            }}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="cpu"
            name="CPU Laptop"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#3b82f6",
            }}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="ram"
            name="RAM Laptop"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#14b8a6",
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}