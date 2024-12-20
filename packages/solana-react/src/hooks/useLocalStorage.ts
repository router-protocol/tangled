import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, defaultState: T): [T, Dispatch<SetStateAction<T>>] {
  const state = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value) as T;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        console.error(error);
      }
    }

    return defaultState;
  });
  const value = state[0];

  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        console.error(error);
      }
    }
  }, [value, key]);

  return state;
}
