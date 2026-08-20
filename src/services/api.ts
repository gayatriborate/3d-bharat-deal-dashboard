/**
 * Simulated network layer.
 *
 * Since no backend is available, every "request" goes through here so the
 * rest of the app behaves exactly as it would against a real API: it waits,
 * it can fail, and it always returns a Promise.
 */

export interface ApiError {
  message: string;
  status: number;
}

const MIN_DELAY = 300;
const MAX_DELAY = 800;

function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

/**
 * Wraps any synchronous data resolver in a Promise with an artificial
 * network delay, and a small, configurable chance of failure so error
 * states in the UI are actually exercised.
 */
export function simulateRequest<T>(
  resolver: () => T,
  options?: { errorRate?: number; errorMessage?: string }
): Promise<T> {
  const errorRate = options?.errorRate ?? 0;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (errorRate > 0 && Math.random() < errorRate) {
        reject({
          message: options?.errorMessage ?? "Something went wrong while fetching data.",
          status: 500,
        } as ApiError);
        return;
      }
      try {
        resolve(resolver());
      } catch (err) {
        reject({ message: (err as Error).message, status: 500 } as ApiError);
      }
    }, randomDelay());
  });
}
