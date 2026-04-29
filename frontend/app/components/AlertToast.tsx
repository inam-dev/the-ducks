import React, { useEffect } from 'react';

interface AlertToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  duration?: number;
}

export function AlertToast({ message, type = 'info', onClose, duration = 3000 }: AlertToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${styles[type]} shadow-lg z-50 max-w-sm`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
