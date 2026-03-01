import { useState, useCallback } from 'react';

export function useSessionState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.sessionStorage.getItem(key);
        if (item) {
           const parsed = JSON.parse(item);
           // Expire after 60 minutes
           if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
               return parsed.value;
           }
        }
      } catch (error) {
        console.warn(`Error reading sessionStorage key "${key}":`, error);
      }
    }
    return initialValue;
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setState(prevState => {
        const valueToStore = value instanceof Function ? value(prevState) : value;
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), value: valueToStore }));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key]);

  return [state, setValue];
}
