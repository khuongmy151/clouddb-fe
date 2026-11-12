type CpuDataPoint = {
  hour: string;
  usage: number;
};

const cpuData: CpuDataPoint[] = [
  { hour: '08:00', usage: 40 },
  { hour: '09:00', usage: 55 },
  { hour: '10:00', usage: 45 },
  { hour: '11:00', usage: 70 },
  { hour: '12:00', usage: 60 },
  { hour: '13:00', usage: 80 },
  { hour: '14:00', usage: 65 },
  { hour: '15:00', usage: 50 },
  { hour: '16:00', usage: 75 },
  { hour: '17:00', usage: 85 },
  { hour: '18:00', usage: 70 },
  { hour: '19:00', usage: 60 },
  { hour: '20:00', usage: 90 },
  { hour: '21:00', usage: 75 },
  { hour: '22:00', usage: 55 },
];

export default function CpuUsageChart() {
  return (
    <div className="mt-6 border-t border-gray-700 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h4 className="text-sm font-semibold text-white">CPU Usage History</h4>
          <p className="text-xs text-gray-400 mt-1">
            Mức sử dụng CPU theo từng giờ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          CPU (%)
        </div>
      </div>

      {/* Dữ liệu minh họa; có thể thay bằng dữ liệu từ API backend. */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          <div className="flex gap-3">
            {/* Trục Y: phần trăm CPU */}
            <div className="flex flex-col justify-between h-44 pb-1 text-[11px] text-gray-400">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Khu vực biểu đồ */}
            <div className="relative flex-1 h-44">
              <div className="absolute inset-0 flex flex-col justify-between pb-1 pointer-events-none">
                {[100, 75, 50, 25, 0].map((value) => (
                  <div key={value} className="w-full border-t border-gray-700/80" />
                ))}
              </div>

              {/* Các cột CPU */}
              <div className="absolute inset-0 flex items-end gap-1">
                {cpuData.map((item) => (
                  <div
                    key={item.hour}
                    className="group relative flex-1 h-full flex flex-col justify-end items-center"
                  >
                    <span
                      className="absolute z-10 text-[10px] text-blue-200 whitespace-nowrap"
                      style={{ bottom: `calc(${item.usage}% + 5px)` }}
                    >
                      {item.usage}%
                    </span>
                    <div
                      title={`${item.hour} - CPU ${item.usage}%`}
                      className="w-full rounded-t-sm bg-blue-500/80 hover:bg-blue-400 transition-colors cursor-pointer"
                      style={{ height: `${item.usage}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trục X: thời gian */}
          <div className="flex gap-3 mt-2">
            <div className="w-[38px] shrink-0" />
            <div className="flex-1 flex gap-1">
              {cpuData.map((item) => (
                <div
                  key={item.hour}
                  className="flex-1 text-center text-[10px] text-gray-400"
                >
                  {item.hour}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Thời gian (giờ)
          </p>
        </div>
      </div>
    </div>
  );
}
