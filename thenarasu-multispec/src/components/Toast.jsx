import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <div className="toast-content">
        <span>{message}</span>
        <button type="button" className="toast-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          ×
        </button>
      </div>
    </div>
  );
}
