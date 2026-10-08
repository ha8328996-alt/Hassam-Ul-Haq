import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        title,
        description: options?.description,
        type: options?.type || 'info',
      };
      setToasts((prev) => [...prev, newToast]);
      const duration = options?.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => {
    showToast(title, { description, type: 'success' });
  }, [showToast]);

  const error = useCallback((title: string, description?: string) => {
    showToast(title, { description, type: 'error' });
  }, [showToast]);

  const info = useCallback((title: string, description?: string) => {
    showToast(title, { description, type: 'info' });
  }, [showToast]);

  const warning = useCallback((title: string, description?: string) => {
    showToast(title, { description, type: 'warning' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border bg-neutral-900/95 dark:bg-neutral-900/95 backdrop-blur-md border-neutral-800 text-white shadow-xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-sky-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold tracking-tight text-neutral-100">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-neutral-400 hover:text-neutral-200 p-0.5 rounded transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
