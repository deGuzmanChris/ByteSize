"use client";


import { GoogleOAuthProvider } from "@react-oauth/google";
import { DarkModeProvider } from "../lib/DarkModeContext";

export function Providers({ children }) {
  return (
    <DarkModeProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </DarkModeProvider>
  );
}
