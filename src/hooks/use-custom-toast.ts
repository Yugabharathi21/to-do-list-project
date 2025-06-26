import { toast as sonnerToast } from 'sonner';
import { MouseEvent, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

// Import proper types from sonner
type Action = {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  id?: string;
  description?: string | ReactNode;
  action?: Action;
  className?: string;
}

export function useCustomToast() {
  // Helper function to show toast with type
  const showToast = (
    type: ToastType,
    title: string,
    options?: ToastOptions
  ) => {
    const toastFn = sonnerToast[type === 'default' ? 'message' : type];
    
    return toastFn(title, {
      className: `toast-${type}`,
      ...options
    });
  };

  return {
    // Type-specific functions
    success: (title: string, options?: ToastOptions) => 
      showToast('success', title, options),
    
    error: (title: string, options?: ToastOptions) => 
      showToast('error', title, options),
    
    warning: (title: string, options?: ToastOptions) => 
      showToast('warning', title, options),
    
    info: (title: string, options?: ToastOptions) => 
      showToast('info', title, options),
    
    default: (title: string, options?: ToastOptions) => 
      showToast('default', title, options),
    
    // Promise toast - shows loading, success, error states
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      },
      options?: ToastOptions
    ) => {
      return sonnerToast.promise(promise, {
        ...messages,
        ...(options || {})
      });
    },
    
    // Dismiss specific or all toasts
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
}
