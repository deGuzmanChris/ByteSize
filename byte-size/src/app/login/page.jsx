"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
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
      if (error.code === 'auth/user-not-found') {
        alert("No account found. Please contact a manager to create your account.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Incorrect password. Please try again.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#232a23]' : 'bg-gray-100'}`}>
      <div className={`${tokens.cardBg} p-8 rounded-xl shadow-md w-full max-w-sm text-center ${tokens.text}`}>
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${tokens.sidebarBorder} ${tokens.text} ${darkMode ? 'bg-[#393939]' : 'bg-white'}`}
              placeholder="yourname@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${tokens.sidebarBorder} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${tokens.text} ${darkMode ? 'bg-[#393939]' : 'bg-white'}`}
              placeholder="••••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`${darkMode ? 'bg-[#232a23]' : 'bg-white'} text-gray-500 px-2`}>Or</span>
          </div>
        </div>

        <p className="text-gray-500 mb-4 text-sm">Sign in with Google</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleGoogleSignIn}
            className={`w-full ${darkMode ? 'bg-[#393939] border-[#555] text-white' : 'bg-white border border-gray-300 text-gray-700'} font-semibold py-2 rounded hover:bg-gray-50`}
          >
            Continue with Google
          </button>
          <button
            onClick={() => router.push("/login/email")}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
          >
            Continue with Email
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account? Contact your manager.
        </p>
      </div>
    </div>
  );
}
