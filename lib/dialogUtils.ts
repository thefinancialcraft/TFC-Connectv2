/**
 * Dialog utility functions to replace console messages with dialog boxes
 */

export const showDialog = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
  if (typeof window !== 'undefined' && (window as any).showDialog) {
    (window as any).showDialog({
      message,
      title: title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Information'),
      type,
    });
  } else {
    // Fallback to console if dialog is not available
    console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log'](message);
  }
};

// Convenience functions
export const showSuccess = (message: string, title?: string) => {
  showDialog(message, 'success', title);
};

export const showError = (message: string, title?: string) => {
  showDialog(message, 'error', title);
};

export const showInfo = (message: string, title?: string) => {
  showDialog(message, 'info', title);
};

export const showWarning = (message: string, title?: string) => {
  showDialog(message, 'warning', title);
};

/**
 * Replace console methods with dialog boxes (optional, for automatic replacement)
 * Call this once in your app initialization if you want to replace all console calls
 */
export const replaceConsoleWithDialog = () => {
  if (typeof window === 'undefined') return;

  const originalConsole = { ...console };

  // Replace console.error with dialog
  console.error = (...args: any[]) => {
    originalConsole.error(...args); // Still log to console for debugging
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    showError(message, 'Error');
  };

  // Replace console.warn with dialog
  console.warn = (...args: any[]) => {
    originalConsole.warn(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    showWarning(message, 'Warning');
  };

  // Optionally replace console.log (not recommended, too verbose)
  // Uncomment if you want to replace console.log as well
  /*
  console.log = (...args: any[]) => {
    originalConsole.log(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    showInfo(message, 'Information');
  };
  */
};

