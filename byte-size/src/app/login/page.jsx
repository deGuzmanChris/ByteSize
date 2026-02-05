"use client";

import { useRouter } from "next/navigation";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">
          Sign in with Google to continue
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow hover:bg-gray-50 flex items-center justify-center w-full"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}