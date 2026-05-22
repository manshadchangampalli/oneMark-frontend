import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full sm:max-w-md mx-auto bg-paper dark:bg-paper-dark rounded-t-2xl sm:rounded-2xl border border-line dark:border-line-dark shadow-xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {(title || description) && (
          <div className="px-5 pt-5 pb-3 border-b border-line dark:border-line-dark">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink dark:text-ink-dark">{title}</h2>
                )}
                {description && (
                  <p className="text-[12.5px] text-ink-muted dark:text-ink-muted-dark mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1 rounded text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
