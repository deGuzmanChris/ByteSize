"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { getUserByEmail } from "../../lib/users";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import { CookieIcon, CookieBackground } from "../components/CookieBackground";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: "Please enter your email address.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const employee = await getUserByEmail(email);
      if (!employee) {
        setMessage({
          text: "No account found with this email address. Please contact your manager.",
          type: "error",
        });
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setMessage({
        text: "Password reset email sent! Check your inbox for instructions.",
        type: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Forgot Password Error:", error);
      if (error.code === "auth/invalid-email") {
        setMessage({ text: "Invalid email address.", type: "error" });
      } else {
        setMessage({ text: error.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CookieBackground darkMode={darkMode} id="forgot-password" />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className={`${tokens.cardBg} p-8 rounded-xl shadow-lg w-full max-w-sm text-center ${tokens.text}`}>
          {/* Cookie icon + brand */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <CookieIcon size={32} />
            <h1 className="text-2xl font-bold">ByteSize</h1>
          </div>
          <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Recover your password
          </p>

          {/* Reset form */}
          <form onSubmit={handleSendReset} className="mb-4">
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg border ${tokens.sidebarBorder} ${tokens.text} ${darkMode ? "bg-[#393939]" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-[#89986D]`}
                placeholder="yourname@example.com"
                disabled={loading}
              />
            </div>

            <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#89986D] text-[#F6F0D7] font-semibold py-2 px-4 rounded hover:bg-[#7a8960] disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          {/* Message */}
          {message.text && (
            <div
              className={`text-sm px-3 py-2 rounded mb-4 ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Back to login link */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className={`w-full font-semibold py-2 px-4 rounded text-sm transition-colors ${
              darkMode
                ? "bg-[#393939] border border-[#555] text-white hover:bg-[#444]"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
