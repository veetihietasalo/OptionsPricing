import { useEffect, useState } from 'react';

// Base URL of the pricing API. Set VITE_API_URL at build time to point somewhere else.
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface PostState<T> {
  key: string;
  data: T | null;
}

/**
 * POSTs `body` to the API and fetches again when the body changes.
 * A response to an older body is ignored. The last good data stays on screen
 * while a new request runs, and when a request fails.
 */
export function usePost<T>(path: string, body: unknown): { data: T | null; loading: boolean } {
  const key = JSON.stringify(body);
  const [state, setState] = useState<PostState<T>>({ key: '', data: null });

  useEffect(() => {
    let ignore = false;

    async function load() {
      let next: T | null = null;
      try {
        const response = await fetch(`${API_URL}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: key,
        });
        const json = await response.json();
        if (json.success) {
          next = json.data as T;
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
      if (!ignore) {
        setState((prev) => ({ key, data: next ?? prev.data }));
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [path, key]);

  return { data: state.data, loading: state.key !== key };
}
