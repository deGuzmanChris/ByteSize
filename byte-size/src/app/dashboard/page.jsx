"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import useAuth, { clearAuthCookie } from "../../lib/useAuth";
import { getUserById } from "../../lib/users";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import DarkToggle from "../components/DarkToggle.jsx";
import { CookieIcon, CookieBackground } from "../components/CookieBackground";
import InventoryPage from "../inventory/page";
import { AreaItemList } from "../area-item-list/page";
import OrderPage from "../order/page";
import ReportsPage from "../reports/page";
import SettingsPage from "../settings/page";

const SIDEBAR_BREAKPOINT = 768;

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const { darkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState("inventory");
  const [activeArea, setActiveArea] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
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
      if (doc?.role) setCurrentRole(doc.role);
    });
  }, [user]);

  const allTabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  const tabs = allTabs.filter((t) => !t.roles || t.roles.includes(currentRole));

  const handleLogout = async () => {
    try {
      clearAuthCookie();
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  function handleTabClick(id) {
    setActiveTab(id);
    setActiveArea(null);
    setSidebarOpen(false);
  }

  if (loading || !user) return <div>Loading...</div>;

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
      {/* Brand with cookie icon */}
      <h2 className={`flex items-center justify-center gap-2 text-xl font-semibold py-5 border-b ${sidebarBorder}`}>
        <CookieIcon size={22} />
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
    <div className={`relative flex flex-col md:flex-row h-screen ${bg} font-sans min-w-90 transition-colors duration-200`}>
      <CookieBackground darkMode={darkMode} id="dashboard" />
      {/* Mobile top bar */}
      <header className={`relative z-10 md:hidden flex items-center ${sidebarBg} text-[#F6F0D7] px-4 h-14 shrink-0 transition-colors duration-200`}>
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
        <span className="ml-4 text-xl font-semibold flex-1 flex items-center gap-2">
          <CookieIcon size={20} />
          ByteSize
        </span>
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
      <main className="relative z-10 flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && (
          <section>
            <div className={`${cardBg} ${text} rounded-xl shadow-md p-6 max-w-3xl mx-auto transition-colors duration-200`}>
              {activeArea ? (
                <AreaItemList areaName={activeArea} onBack={() => setActiveArea(null)} />
              ) : (
                <InventoryPage onAreaSelect={setActiveArea} currentRole={currentRole} />
              )}
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
              <SettingsPage currentRole={currentRole} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
