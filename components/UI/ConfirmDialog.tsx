import { Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-overlay rounded-xl p-6 w-[90%] max-w-sm flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Trash2 size={24} className="text-red-400" />
          <h2 className="text-text font-semibold text-lg">Are you sure?</h2>
          <p className="text-primary text-sm">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-md border dark:border-white/10 border-black/10 text-primary hover:bg-secondary-hover transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-md border dark:border-white/10 border-black/10 text-primary hover:bg-red-400 hover:text-white transition-all text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
