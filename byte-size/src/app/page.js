"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");

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
        {activeTab === "inventory" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-black">Inventory</h1>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-[#8fa481] text-white rounded shadow hover:bg-[#7a926e] transition">Create Area</button>
                <button className="px-4 py-2 bg-[#e6cfa7] text-black rounded shadow hover:bg-[#d6be97] transition">Edit Area</button>
                <button className="px-4 py-2 bg-[#d9534f] text-white rounded shadow hover:bg-[#c9302c] transition">Delete Area</button>
              </div>
            </div>
            <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"></div>
          </section>
        )}

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
