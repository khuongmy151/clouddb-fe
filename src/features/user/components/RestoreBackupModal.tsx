import { useState, useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface RestoreBackupModalProps {
  isOpen: boolean;
  databaseName: string;
  backupFileName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RestoreBackupModal({
  isOpen,
  databaseName,
  backupFileName,
  onCancel,
  onConfirm,
}: RestoreBackupModalProps) {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = confirmText === databaseName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xác nhận phục hồi database?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn đang chuẩn bị phục hồi database{' '}
              <span className="font-semibold text-gray-900">{databaseName}</span> từ
              bản backup:
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800 break-all">
              {backupFileName}
            </p>
          </div>

          {/* Warning box */}
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Cảnh báo: dữ liệu hiện tại sẽ bị ghi đè</p>
                <p className="mt-1">
                  Tất cả dữ liệu hiện có trong database sẽ được thay thế bằng dữ liệu
                  từ bản backup. Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
          </div>

          {/* Confirm input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nhập chính xác tên database để xác nhận
            </label>
            <div className="text-sm text-gray-500 mb-2 font-mono bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
              {databaseName}
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Nhập tên database tại đây"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmed}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                isConfirmed
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-300 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Phục hồi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}