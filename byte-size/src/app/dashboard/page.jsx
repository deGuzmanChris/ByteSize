"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import useAuth from "../../lib/useAuth";
import { getUserById, setMustChangePassword } from "../../lib/users";
import { DarkModeProvider, useDarkMode } from "../../lib/DarkModeContext";
import InventoryPage from "../inventory/page";
import OrderPage from "../order/page";
import ReportsPage from "../reports/page";
import SettingsPage from "../settings/page";

const SIDEBAR_BREAKPOINT = 768;

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

// Outer component: provides the dark mode context to all children
export default function Dashboard() {
  return (
    <DarkModeProvider>
      <DashboardContent />
    </DarkModeProvider>
  );
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

  // Dark mode color tokens
  const bg = darkMode ? "bg-[#1e1e1e]" : "bg-[#F6F0D7]";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";
  const sidebarBg = darkMode ? "bg-[#4a5c38]" : "bg-[#89986D]";
  const sidebarActiveBg = darkMode ? "bg-[#3a4a2c]" : "bg-[#9CAB84]";
  const sidebarHover = darkMode ? "hover:bg-[#3a4a2c]/70" : "hover:bg-[#9CAB84]/70";
  const sidebarBorder = darkMode ? "border-[#3a4a2c]" : "border-[#9CAB84]";
  const logoutBg = darkMode ? "bg-[#3a4a2c] hover:bg-[#2e3b22]" : "bg-[#7C8A5F] hover:bg-[#6E7B54]";
  const text = darkMode ? "text-[#f0f0f0]" : "text-black";

  const DarkToggle = ({ className = "" }) => (
    <button
      onClick={() => setDarkMode((v) => !v)}
      aria-label="Toggle dark mode"
      className={`p-2 rounded transition-colors ${sidebarHover} ${className}`}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );

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
        <DarkToggle />
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
        <DarkToggle />
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
