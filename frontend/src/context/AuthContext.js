import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // INIT USER IN BACKEND
  const initUserInBackend = async (user) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await fetch(`${API_URL}/api/user/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (err) {
      console.error("Backend init failed", err);
    }
  };

  useEffect(() => {
    // ── Initial session ───────────────────────────────────────────────────────
    // Silently restore the session on page load / refresh — no toast.
    // We use sessionStorage to track whether the "login" toast has already been
    // shown in this browser tab. sessionStorage survives F5 refreshes but is
    // automatically cleared when the tab is closed, so the toast reappears on
    // the next fresh login — exactly what we want.
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) initUserInBackend(currentUser);
      setLoading(false);
    });

    // ── Auth state listener ───────────────────────────────────────────────────
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (event === "SIGNED_IN" && newUser) {
          // 'authSessionActive' is absent on the very first login of this tab.
          // It stays set across page refreshes → no duplicate toasts.
          const alreadyNotified = sessionStorage.getItem("authSessionActive");
          if (!alreadyNotified) {
            sessionStorage.setItem("authSessionActive", "true");
            toast.success("Login successful! You can now see the dashboard.");
          }
          initUserInBackend(newUser);
        }

        if (event === "SIGNED_OUT") {
          // Clear so the toast fires again on the next login.
          sessionStorage.removeItem("authSessionActive");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
