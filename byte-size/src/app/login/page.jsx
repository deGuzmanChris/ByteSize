"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import { CookieIcon, CookieBackground } from "../components/CookieBackground";
import { setAuthCookie } from "../../lib/useAuth";
import { getUserByEmail } from "../../lib/users";

export default function LoginPage() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const employee = await getUserByEmail(user.email);
      if (!employee) {
        await signOut(auth);
        alert("Access denied. Your Google account is not registered as an employee. Please contact your manager.");
        return;
      }
      const token = await user.getIdToken();
      setAuthCookie(token);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Google Sign-In failed");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      setAuthCookie(token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      if (error.code === "auth/user-not-found") {
        alert("No account found. Please contact a manager to create your account.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CookieBackground darkMode={darkMode} id="login" />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className={`${tokens.cardBg} p-8 rounded-xl shadow-lg w-full max-w-sm text-center ${tokens.text}`}>

          {/* Cookie icon + brand */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <CookieIcon size={32} />
            <h1 className="text-2xl font-bold">ByteSize</h1>
          </div>
          <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to continue
          </p>

          {/* Email / Password form */}
          <form onSubmit={handleEmailSignIn} className="mb-4">
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg border ${tokens.sidebarBorder} ${tokens.text} ${darkMode ? "bg-[#393939]" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-[#89986D]`}
                placeholder="yourname@example.com"
              />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${tokens.sidebarBorder} rounded ${tokens.text} ${darkMode ? "bg-[#393939]" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-[#89986D]`}
                placeholder="••••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#89986D] text-[#F6F0D7] font-semibold py-2 px-4 rounded hover:bg-[#7a8960] transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? "border-[#444]" : "border-gray-300"}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`${tokens.cardBg} text-gray-500 px-2`}>or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className={`w-full mb-2 border font-semibold py-2 rounded transition-colors ${
              darkMode
                ? "bg-[#393939] border-[#555] text-white hover:bg-[#444]"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Don&apos;t have an account? Contact your manager.
          </p>
        </div>
      </div>
    </div>
  );
}
