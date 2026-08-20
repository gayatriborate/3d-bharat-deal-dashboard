import { useEffect, useRef, useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic async-fetch hook: loading / error / data states, with a manual
 * retry escape hatch for simulated-failure UI states.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> & { retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/use-memo -- deps is intentionally caller-supplied for this generic hook */
  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (mounted.current) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (mounted.current)
          setState({ data: null, loading: false, error: err?.message ?? "Something went wrong" });
      });
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/use-memo */

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, retry: run };
}
