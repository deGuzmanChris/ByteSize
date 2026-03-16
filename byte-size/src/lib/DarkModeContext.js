"use client";

import { createContext, useContext, useState, useEffect } from "react";


const DarkModeContext = createContext({ darkMode: false, setDarkMode: () => {} });

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    setDarkMode(stored === null ? false : stored === "true");
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("darkMode", darkMode);
    }
  }, [darkMode, hasMounted]);

  if (!hasMounted) return null;

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
