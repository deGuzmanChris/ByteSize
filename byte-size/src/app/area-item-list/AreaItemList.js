"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { id: "inventory", label: "Inventory" },
  { id: "ordering", label: "Ordering" },
  { id: "prep", label: "Prep Lists" },
  { id: "settings", label: "Settings" },
];

export default function AreaItemListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaName = searchParams.get("areaName");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemName.trim() === "") return;
    setItems([...items, { name: newItemName.trim(), description: "" }]);
    setNewItemName("");
    setShowAddModal(false);
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
            onClick={() => {
              if (tab.id === "inventory") {
                window.location.href = "/";
              } else {
                window.location.href = `/?tab=${tab.id}`;
              }
            }}
            className={`text-left px-5 py-4 transition-colors 
              ${tab.id === "inventory" ? "bg-[#9CAB84]" : "hover:bg-[#9CAB84]/70"}`}
          >
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">{areaName}</h1>
          <button
            className="px-4 py-2 bg-[#89986D] text-white rounded shadow hover:bg-[#7a926e] transition"
            onClick={() => setShowAddModal(true)}
          >
            Add Item
          </button>
        </div>
        <div className="mb-6">
          <input
            className="w-full p-3 rounded bg-white border shadow-md focus:shadow-lg transition-shadow"
            type="text"
            placeholder="Search Items"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filteredItems.length === 0 ? (
          <div className="mb-8 bg-[#F6F0D7] rounded-xl shadow-md p-6 min-h-16 flex items-center">
            <span className="text-gray-400 text-base">No items yet.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredItems.map((item, idx) => (
              <li key={idx} className="bg-[#F6F0D7] rounded-xl shadow-md p-6 min-h-16 flex flex-col justify-center">
                <div className="font-semibold text-base">{item.name}</div>
                <div className="text-gray-600 text-sm">{item.description}</div>
              </li>
            ))}
          </ul>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)} title="Add an Item">
            <form className="flex flex-col gap-4" onSubmit={handleAddItem}>
              <input
                className="border rounded p-2 w-full"
                type="text"
                placeholder="Enter item name"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#89986D] text-white rounded">Add</button>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(246, 240, 215, 0.7)' }}>
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
