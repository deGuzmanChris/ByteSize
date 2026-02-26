"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider, db } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Firebase Google User:", user);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log("Firebase Email User:", user);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
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
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <p className="text-gray-500 mb-4 text-sm">Sign in with Google</p>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow hover:bg-gray-50 flex items-center justify-center w-full"
          >
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account? Contact your manager.
        </p>
      </div>
    </div>
  );
}