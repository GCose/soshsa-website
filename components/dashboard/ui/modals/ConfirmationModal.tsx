import { X, AlertTriangle } from "lucide-react";
import { ConfirmationModalProps } from "@/types/interface/dashboard";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    info: {
      icon: "text-primary",
      iconBg: "bg-teal-100",
      button: "bg-primary hover:bg-primary/90 text-white",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div
            className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${styles.iconBg} mb-4`}
          >
            <AlertTriangle className={styles.icon} size={24} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`cursor-pointer flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
