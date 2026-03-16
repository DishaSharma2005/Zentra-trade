import { authFetch } from "./authFetch";

/**
 * Drop-in replacement for authFetch with automatic retry on server errors.
 *
 * Handles Render free-tier cold starts — if the backend is waking up and
 * returns a 5xx error, this will silently retry up to `retries` times
 * before giving up. From the user's perspective the request just takes
 * a second longer; they never see an error from a cold start.
 *
 * Usage: apiFetch(url, options)  ← exactly the same as authFetch()
 *
 * @param {string} url
 * @param {object} options  - same fetch options as authFetch
 * @param {number} retries  - max retry attempts (default 3)
 * @param {number} delay    - ms to wait between retries (default 2000)
 */
export const apiFetch = async (url, options = {}, retries = 3, delay = 2000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await authFetch(url, options);

      // Success or a client error (4xx) — don't retry, return as-is
      if (res.ok || res.status < 500) return res;

      // Server error (5xx) — wait and retry unless this was the last attempt
      if (attempt < retries - 1) {
        console.warn(`[apiFetch] Server error ${res.status} on "${url}" — retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, delay));
      }
    } catch (err) {
      // Network error (server totally down / cold start network timeout)
      if (attempt < retries - 1) {
        console.warn(`[apiFetch] Network error on "${url}" — retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err; // All retries exhausted — propagate the error
      }
    }
  }
};
