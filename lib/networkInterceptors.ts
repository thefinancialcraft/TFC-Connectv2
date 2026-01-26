/**
 * Global Network Interceptor
 * Halts all outgoing fetch requests when offline and resumes them automatically
 * once the connection is restored.
 */
export function initNetworkInterceptors() {
  if (typeof window === 'undefined') return;

  // Store the original fetch function
  const originalFetch = window.fetch;

  // Redefine window.fetch
  window.fetch = async (...args) => {
    // If the browser is offline, pause execution until it's back online
    if (!window.navigator.onLine) {
      console.warn("📶 [Network] Request paused - Browser is offline. Waiting for connection...");
      
      // Wait for the 'online' event
      await new Promise<void>((resolve) => {
        const handleOnline = () => {
          window.removeEventListener('online', handleOnline);
          console.log("🌐 [Network] Connection restored. Resuming paused request.");
          
          // Small buffer to let the OS fully establish connection before firing
          setTimeout(resolve, 300); 
        };
        window.addEventListener('online', handleOnline);
      });
    }

    // Call the original fetch
    return originalFetch(...args);
  };

  console.log("🛠️ [System] Global Network Interceptors initialized.");
}
