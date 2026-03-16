import { supabase } from "../supabaseClient";

/**
 * A drop-in replacement for `fetch` that automatically attaches
 * the Supabase JWT Authorization header to every request.
 *
 * Usage: authFetch(url, options) — same as fetch()
 */
export const authFetch = async (url, options = {}) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
