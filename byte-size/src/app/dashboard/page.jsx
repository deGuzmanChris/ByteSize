"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import useAuth from "../../lib/useAuth";
import { getUserById, setMustChangePassword } from "../../lib/users";
import InventoryPage from "../inventory/page";
import OrderPage from "../order/page";
import SettingsPage from "../settings/page";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [mustChangePassword, setMustChangePasswordState] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Check mustChangePassword flag after user resolves
  useEffect(() => {
    if (!user) return;
    getUserById(user.uid).then((doc) => {
      if (doc?.mustChangePassword) setMustChangePasswordState(true);
    });
  }, [user]);

  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError("");

    if (pwForm.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      // Re-authenticate before changing password
      const credential = EmailAuthProvider.credential(user.email, pwForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, pwForm.next);
      await setMustChangePassword(user.uid, false);
      setMustChangePasswordState(false);
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPwError("Current password is incorrect.");
      } else {
        setPwError(err.message);
      }
    } finally {
      setPwLoading(false);
    }
  }

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-[#F6F0D7] font-sans">
      {/* Blocking change-password overlay */}
      {mustChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-black">Set your password</h2>
            <p className="text-sm text-gray-500 mb-5">
              You must set a new password before continuing.
            </p>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={pwForm.current}
                onChange={(e) => setPwForm((s) => ({ ...s, current: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black"
                disabled={pwLoading}
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={pwForm.next}
                onChange={(e) => setPwForm((s) => ({ ...s, next: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black"
                disabled={pwLoading}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((s) => ({ ...s, confirm: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black"
                disabled={pwLoading}
                required
              />
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-[#89986D] text-white py-2 rounded hover:bg-[#7a8960] disabled:opacity-50"
              >
                {pwLoading ? "Saving..." : "Set password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-60 bg-[#89986D] text-[#F6F0D7] flex flex-col">
        <h2 className="text-center text-xl font-semibold py-5 border-b border-[#9CAB84]">
          ByteSize
        </h2>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-5 py-4 transition-colors
              ${activeTab === tab.id ? "bg-[#9CAB84]" : "hover:bg-[#9CAB84]/70"}`}
          >
            {tab.label}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={handleLogout}
          className="px-5 py-4 text-left bg-[#7C8A5F] hover:bg-[#6E7B54] transition-colors"
        >
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Inventory</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"><InventoryPage /></div>
          </section>
        )}

        {activeTab === "ordering" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Ordering</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"><OrderPage /></div>
          </section>
        )}

        {activeTab === "prep" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Prep Lists</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"></div>
          </section>
        )}

        {activeTab === "settings" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Settings</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"><SettingsPage /></div>
          </section>
        )}
      </main>
    </div>
  );
}
