"use client";

import { useState, useEffect } from "react";

import { onIdTokenChanged } from "firebase/auth";
import { auth } from "./firebase";

// Exported so login pages can set the cookie before navigating
export function setAuthCookie(token) {
  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
  document.cookie = `bytesize-auth=${token}; path=/; expires=${expires}; SameSite=Strict`;
}

export function clearAuthCookie() {
  document.cookie = "bytesize-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // onIdTokenChanged fires on login, logout, and every ~1hr token refresh
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setAuthCookie(token);
        setUser(currentUser);
      } else {
        clearAuthCookie();
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };

}
