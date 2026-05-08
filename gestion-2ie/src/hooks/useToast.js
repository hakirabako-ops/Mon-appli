import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les toasts
 * @returns {Object} { toast, showToast, showSuccess, showError, showInfo }
 */
export function useToast() {
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });

  const showToast = useCallback((type, message, autoClose = 3000) => {
    setToast({ show: true, type, message, autoClose });
  }, []);

  const showSuccess = useCallback((message, autoClose = 3000) => {
    showToast('success', message, autoClose);
  }, [showToast]);

  const showError = useCallback((message, autoClose = 3000) => {
    showToast('error', message, autoClose);
  }, [showToast]);

  const showInfo = useCallback((message, autoClose = 3000) => {
    showToast('info', message, autoClose);
  }, [showToast]);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    closeToast,
  };
}
