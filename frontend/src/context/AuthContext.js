import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This ref is TRUE while we are still doing the first getSession() call.
  // Any SIGNED_IN event that fires during that window is just a session
  // restore (page refresh / revisit), NOT a real login — so we skip the toast.
  const isInitialLoad = useRef(true);

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
    // listen to auth changes — registered BEFORE getSession so we never miss events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        // Only show the login toast for REAL logins/signups, not session restores.
        // isInitialLoad is true while we are still inside the startup getSession() call.
        if (event === "SIGNED_IN" && newUser && !isInitialLoad.current) {
          toast.success("Login successful! You can now see the dashboard.");
        }

        if (newUser) {
          initUserInBackend(newUser);
        }
      }
    );

    // Resolve the initial session — mark initialLoad false once done so
    // any subsequent SIGNED_IN events trigger the toast normally.
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        initUserInBackend(currentUser);
      }

      setLoading(false);

      //  Initial load complete — real logins from here onwards show the toast
      isInitialLoad.current = false;
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
