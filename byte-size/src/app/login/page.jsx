"use client";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const router = useRouter();

    const handleSuccess = (credentialResponse) => {
        const user = jwtDecode(credentialResponse.credential);

        console.log("Google User:", user);

        localStorage.setItem("user", JSON.stringify(user));

        router.push("/");
    };

    console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">
          Sign in with Google to continue
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>
      </div>
    </div>
    );
}