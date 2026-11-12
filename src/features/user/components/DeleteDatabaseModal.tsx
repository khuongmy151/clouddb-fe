import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

type DeleteDatabaseModalProps = {
  isOpen: boolean;
  databaseName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteDatabaseModal({
  isOpen,
  databaseName,
  onCancel,
  onConfirm,
}: DeleteDatabaseModalProps) {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (isOpen) setConfirmation('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const canDelete = confirmation === databaseName;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-db-title"
        aria-describedby="delete-db-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>

          <div className="text-center">
            <h2 id="delete-db-title" className="text-lg font-semibold text-gray-900">
              Xác nhận xóa database?
            </h2>
            <p id="delete-db-description" className="mt-2 text-sm leading-6 text-gray-600">
              Bạn đang chuẩn bị xóa database{' '}
              <span className="font-semibold text-gray-900">{databaseName}</span>.
              Thao tác này có thể khiến dữ liệu không thể khôi phục.
            </p>
          </div>

          <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Cảnh báo: thao tác nguy hiểm</p>
              <p className="mt-1 text-xs leading-5 text-red-700">
                Hãy chắc chắn bạn đã sao lưu dữ liệu quan trọng trước khi tiếp tục.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="delete-db-confirmation" className="mb-2 block text-sm font-medium text-gray-700">
              Nhập chính xác tên database để xác nhận
            </label>
            <div className="mb-2 rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm text-gray-800">
              {databaseName}
            </div>
            <input
              id="delete-db-confirmation"
              autoFocus
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Nhập tên database tại đây"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
            {confirmation.length > 0 && !canDelete && (
              <p className="mt-1.5 text-xs text-red-600">
                Tên database chưa chính xác. Vui lòng kiểm tra lại.
              </p>
            )}
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Hủy xóa
          </button>
          <button
            type="button"
            disabled={!canDelete}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Xóa database
          </button>
        </footer>
      </section>
    </div>
  );
}
