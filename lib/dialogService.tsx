import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Dialog, { DialogOptions } from '../components/Dialog';

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: DialogOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const showDialog = (options: DialogOptions) => {
    setDialogState({
      isOpen: true,
      options,
    });
  };

  const hideDialog = () => {
    setDialogState({
      isOpen: false,
      options: null,
    });
  };

  // Expose dialog functions globally for use outside React components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showDialog = showDialog;
      (window as any).hideDialog = hideDialog;
    }
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {dialogState.options && (
        <Dialog
          isOpen={dialogState.isOpen}
          {...dialogState.options}
          onClose={hideDialog}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

// Helper functions for easy usage
export const dialogHelpers = {
  success: (message: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).showDialog) {
      (window as any).showDialog({
        message,
        title: title || 'Success',
        type: 'success',
      });
    }
  },
  error: (message: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).showDialog) {
      (window as any).showDialog({
        message,
        title: title || 'Error',
        type: 'error',
      });
    }
  },
  info: (message: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).showDialog) {
      (window as any).showDialog({
        message,
        title: title || 'Information',
        type: 'info',
      });
    }
  },
  warning: (message: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).showDialog) {
      (window as any).showDialog({
        message,
        title: title || 'Warning',
        type: 'warning',
      });
    }
  },
};

