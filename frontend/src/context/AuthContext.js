import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 INIT USER IN BACKEND
  const initUserInBackend = async (user) => {
    try {
      console.log("🔥 Initializing user in backend:", user.id);

      await fetch("http://localhost:5000/api/user/init", {
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
    // initial session
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        initUserInBackend(currentUser);
      }

      setLoading(false);
    });

    // listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (newUser) {
          initUserInBackend(newUser);
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
