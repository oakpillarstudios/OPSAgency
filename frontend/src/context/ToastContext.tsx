'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icon = {
            success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          }[toast.type];

          const bgBorder = {
            success: 'bg-white border-emerald-100 shadow-emerald-500/5',
            error: 'bg-white border-rose-100 shadow-rose-500/5',
            info: 'bg-white border-blue-100 shadow-blue-500/5',
            warning: 'bg-white border-amber-100 shadow-amber-500/5'
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border bg-white shadow-xl animate-fade-in ${bgBorder} transition-all duration-300 transform hover:scale-[1.02]`}
              style={{ contentVisibility: 'auto' }}
              role="alert"
            >
              {icon}
              <div className="flex-1 text-xs font-semibold text-navy leading-normal">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-navy-slate hover:text-navy transition-colors shrink-0 p-0.5 rounded-lg hover:bg-navy-dark/40 cursor-pointer"
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
