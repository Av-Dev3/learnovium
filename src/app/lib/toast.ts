import { toast as sonnerToast } from "sonner";

// Re-export the main toast function
export const toast = sonnerToast;

// Convenience wrappers for common toast types
export const info = (message: string) => sonnerToast.info(message);
export const success = (message: string) => sonnerToast.success(message);
export const error = (message: string) => sonnerToast.error(message);
export const warning = (message: string) => sonnerToast.warning(message);

// Extended toast functions with more options
export const toastInfo = (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => 
  sonnerToast.info(message, options);

export const toastSuccess = (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => 
  sonnerToast.success(message, options);

export const toastError = (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => 
  sonnerToast.error(message, options);

export const toastWarning = (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => 
  sonnerToast.warning(message, options);

// Promise-based toast helpers
export const toastPromise = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string;
    error: string;
  }
) => sonnerToast.promise(promise, { loading, success, error }); 