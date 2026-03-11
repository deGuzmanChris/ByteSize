"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const authValue = useMemo(() => ({ user, loading }), [user, loading]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}