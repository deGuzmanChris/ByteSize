"use client";

import { useState, useEffect } from "react";
import InventoryPage from "./InventoryPage";
import OrderPage from "./order/OrderPage";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inventory");

  // Set initial tab from URL query (?tab=)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["inventory", "ordering", "prep", "settings"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    { id: "settings", label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-[#F6F0D7] font-sans">
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

        <div className="flex-1"/>

        <button 
          onClick={handleLogout}
          className="px-5 py-4 text-left bg-[#7C8A5F] hover:bg-[#6E7B54] transition-colors"
        >
          Log out
        </button>
      </aside>


      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && <InventoryPage />}
        {activeTab === "ordering" && <OrderPage />}

        {activeTab === "prep" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Prep Lists</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">

            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Settings</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">

            </div>
          </section>
        )}
      </main>
    </div>
  );
}
