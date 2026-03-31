"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import { CookieIcon, CookieBackground } from "../components/CookieBackground";
import { setAuthCookie } from "../../lib/useAuth";
import { getUserByEmail } from "../../lib/users";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState({ text: "", type: "" });

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
    if (recaptchaSiteKey && !captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotMsg({ text: "Please enter your email.", type: "error" });
      return;
    }
    try {
      const employee = await getUserByEmail(trimmed);
      if (!employee) {
        setForgotMsg({ text: "No account found with this email.", type: "error" });
        return;
      }
      if (employee.authProvider === "google") {
        setForgotMsg({ text: "This account uses Google Sign-In. Use the Google button instead.", type: "error" });
        return;
      }
      await sendPasswordResetEmail(auth, trimmed);
      setForgotMsg({ text: "Password reset email sent! Check your inbox.", type: "success" });
      setForgotEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotMsg({ text: "Something went wrong. Please try again.", type: "error" });
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
            {recaptchaSiteKey && (
              <div className="flex justify-center mb-2">
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={(token) => setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                  theme={darkMode ? "dark" : "light"}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={recaptchaSiteKey && !captchaToken}
              className="w-full bg-[#89986D] text-[#F6F0D7] font-semibold py-2 px-4 rounded hover:bg-[#7a8960] transition-colors disabled:opacity-50"
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

          {!showForgot ? (
            <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setForgotMsg({ text: "", type: "" }); }}
                className="underline hover:text-[#89986D] transition-colors"
              >
                Forgot Password?
              </button>
              <p>Don&apos;t have an account? Contact your manager.</p>
            </div>
          ) : (
            <div className="mt-4">
              <form onSubmit={handleForgotPassword} className="space-y-2">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full p-3 rounded-lg border ${tokens.sidebarBorder} ${tokens.text} ${darkMode ? "bg-[#393939]" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-[#89986D]`}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#89986D] text-[#F6F0D7] font-semibold py-2 px-4 rounded hover:bg-[#7a8960] transition-colors text-sm"
                  >
                    Send Reset Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setForgotMsg({ text: "", type: "" }); setForgotEmail(""); }}
                    className={`px-4 py-2 rounded text-sm font-semibold ${darkMode ? "bg-[#393939] text-gray-300 hover:bg-[#444]" : "bg-gray-200 text-gray-600 hover:bg-gray-300"} transition-colors`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {forgotMsg.text && (
                <p className={`text-xs mt-2 ${forgotMsg.type === "error" ? "text-red-500" : "text-green-600"}`}>
                  {forgotMsg.text}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
