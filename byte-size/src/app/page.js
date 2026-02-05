"use client";

import { useState, useEffect } from "react";
import InventoryPage from "./InventoryPage";

export default function Home() {
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
      </aside>

      
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "inventory" && <InventoryPage />}

        {activeTab === "ordering" && (
          <section>
            <h1 className="text-2xl font-bold mb-6 text-black">Ordering</h1>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">
              
            </div>
          </section>
        )}

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
