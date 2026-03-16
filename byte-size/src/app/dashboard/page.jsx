"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import useAuth from "../../lib/useAuth";
import { getUserById, setMustChangePassword } from "../../lib/users";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import DarkToggle from "../components/DarkToggle.jsx";
import InventoryPage from "../inventory/page";
import OrderPage from "../order/page";
import ReportsPage from "../reports/page";
import SettingsPage from "../settings/page";

const SIDEBAR_BREAKPOINT = 768;

// ...existing code...

// Outer component: just renders the content, context is now global
export default function Dashboard() {
  return <DashboardContent />;
}

// Inner component: consumes dark mode context + all page logic
function DashboardContent() {
  const { darkMode, setDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState("inventory");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mustChangePassword, setMustChangePasswordState] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= SIDEBAR_BREAKPOINT) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

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

  function handleTabClick(id) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

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

  // Use shared color tokens
  const tokens = getColorTokens(darkMode);
  const bg = tokens.bg;
  const cardBg = tokens.cardBg;
  const sidebarBg = tokens.sidebarBg;
  const sidebarActiveBg = tokens.sidebarActiveBg;
  const sidebarHover = tokens.sidebarHover;
  const sidebarBorder = tokens.sidebarBorder;
  const logoutBg = tokens.logoutBg;
  const text = tokens.text;

  const sidebarContent = (
    <>
      <h2 className={`text-center text-xl font-semibold py-5 border-b ${sidebarBorder}`}>
        ByteSize
      </h2>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`text-left px-5 py-4 transition-colors
            ${activeTab === tab.id ? sidebarActiveBg : sidebarHover}`}
        >
          {tab.label}
        </button>
      ))}
      <div className="flex-1" />
      <div className={`flex items-center justify-between px-5 py-3 border-t ${sidebarBorder}`}>
        <span className="text-sm opacity-80">{darkMode ? "Dark" : "Light"} mode</span>
        <DarkToggle className={sidebarHover} />
      </div>
      <button onClick={handleLogout} className={`px-5 py-4 text-left transition-colors ${logoutBg}`}>
        Log out
      </button>
    </>
  );

  return (
    <div className={`flex flex-col md:flex-row h-screen ${bg} font-sans min-w-90 transition-colors duration-200`}>
      {/* Change-password overlay */}
      {mustChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${cardBg} rounded-xl shadow-lg p-8 w-full max-w-sm`}>
            <h2 className={`text-xl font-bold mb-2 ${text}`}>Set your password</h2>
            <p className="text-sm text-gray-500 mb-5">You must set a new password before continuing.</p>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input type="password" placeholder="Current password" value={pwForm.current}
                onChange={(e) => setPwForm((s) => ({ ...s, current: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black" disabled={pwLoading} required />
              <input type="password" placeholder="New password" value={pwForm.next}
                onChange={(e) => setPwForm((s) => ({ ...s, next: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black" disabled={pwLoading} required />
              <input type="password" placeholder="Confirm new password" value={pwForm.confirm}
                onChange={(e) => setPwForm((s) => ({ ...s, confirm: e.target.value }))}
                className="w-full px-3 py-2 border rounded text-black" disabled={pwLoading} required />
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
              <button type="submit" disabled={pwLoading}
                className="w-full bg-[#89986D] text-white py-2 rounded hover:bg-[#7a8960] disabled:opacity-50">
                {pwLoading ? "Saving..." : "Set password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <header className={`md:hidden flex items-center ${sidebarBg} text-[#F6F0D7] px-4 h-14 shrink-0 transition-colors duration-200`}>
        <button onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle menu"
          className={`p-2 rounded ${sidebarHover} transition-colors`}>
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <span className="ml-4 text-xl font-semibold flex-1">ByteSize</span>
        <DarkToggle className={sidebarHover} />
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 w-60
        ${sidebarBg} text-[#F6F0D7] flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:shrink-0
      `}>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}>
              <InventoryPage />
            </div>
          </section>
        )}
        {activeTab === "ordering" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}>
              <OrderPage />
            </div>
          </section>
        )}
        {activeTab === "prep" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}></div>
          </section>
        )}
        {activeTab === "reports" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}>
              <ReportsPage />
            </div>
          </section>
        )}
        {activeTab === "settings" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}>
              <SettingsPage />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
