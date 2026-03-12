"use client";

import { createContext, useContext, useState } from "react";

const DarkModeContext = createContext({ darkMode: false, setDarkMode: () => {} });

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
