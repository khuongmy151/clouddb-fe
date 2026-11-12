type DatabaseLogsProps = {
  logs?: string[];
};

const defaultLogs = [
  '[2025-10-20 14:32:01] INFO  Connection established from 113.161.x.x',
  '[2025-10-20 14:32:05] INFO  Query executed: SELECT * FROM users LIMIT 10',
  '[2025-10-20 14:33:12] WARN  Slow query detected (1.2s)',
  '[2025-10-20 14:35:00] INFO  Backup started',
  '[2025-10-20 14:36:45] INFO  Backup completed successfully',
  '[2025-10-20 14:40:22] INFO  Connection closed',
];

export default function DatabaseLogs({ logs = defaultLogs }: DatabaseLogsProps) {
  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </h3>
      </div>

      <div
        role="log"
        aria-live="polite"
        className="bg-gray-900 rounded-lg p-4 font-mono text-xs h-72 overflow-y-auto space-y-1"
      >
        {logs.map((line, index) => (
          <div
            key={`${index}-${line}`}
            className={
              line.includes('WARN')
                ? 'text-amber-400'
                : line.includes('ERROR')
                  ? 'text-red-400'
                  : 'text-green-400'
            }
          >
            {line}
          </div>
        ))}
        <div className="text-gray-500">— waiting for new logs —</div>
      </div>
    </section>
  );
}
