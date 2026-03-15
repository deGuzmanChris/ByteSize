"use client";

import { useState, useEffect } from "react";
import { FaInfoCircle, FaPen, FaTrash, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItem } from "../../lib/inventory";
import { useSearchParams } from "next/navigation";
import DarkToggle from "../components/DarkToggle.jsx";
import Modal from "../components/Modal.jsx";
import { getColorTokens } from "../components/colorTokens.js";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal.jsx";
import EditItemModal from "../components/modals/EditItemModal.jsx";
import ViewItemModal from "../components/modals/ViewItemModal.jsx";
import CreateItemModal from "../components/modals/CreateItemModal.jsx";

const categories = [
  "Produce",
  "Protein",
  "Dry Goods",
  "Dairy",
  "Frozen",
  "Sauces",
];

import { DarkModeProvider, useDarkMode } from "../../lib/DarkModeContext";

function AreaItemListContent() {
  const { darkMode, setDarkMode } = useDarkMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaName = searchParams.get("areaName");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [areaCountInputs, setAreaCountInputs] = useState({});
  const [savedStatus, setSavedStatus] = useState({});
  const [viewItem, setViewItem] = useState(null); // For viewing item info
  const [editItemIdx, setEditItemIdx] = useState(null); // For editing item
  const [deleteItemIdx, setDeleteItemIdx] = useState(null); // For confirming delete
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleQuantityChange = (idx, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: value } : item));
  };
  const handleAreaCountInputChange = (idx, value) => {
    // Only allow numbers or empty string, and max 2 digits
    if ((value === "" || /^\d+$/.test(value)) && value.length <= 2) {
      setAreaCountInputs(inputs => ({ ...inputs, [idx]: value }));
    }
  };
  // Always trigger a save and show the indicator, even if the value is unchanged or cleared
  const handleAreaCountEnter = async (idx) => {
    const item = items[idx];
    let newCount = areaCountInputs[idx];
    // Allow saving even if input is empty (treat as empty string)
    if (newCount === undefined || newCount === null) return;
    // Keep as string for input and storage
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: newCount } : item));
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: newCount }));
    // Update in database as string
    if (item.id) {
      await updateInventoryItem(item.id, { ...item, areaCount: newCount });
      // Always show the save indicator and color, even if value is unchanged
      setSavedStatus(status => ({ ...status, [idx]: true }));
      setTimeout(() => {
        setSavedStatus(status => ({ ...status, [idx]: false }));
      }, 1200);
      // If input is empty, reset input to undefined so placeholder shows
      if (newCount === "") {
        setAreaCountInputs(inputs => ({ ...inputs, [idx]: undefined }));
        setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: "" } : item));
      }
    }
  };

  const filteredItems = items.filter(item =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateItem = async (item) => {
  // Add area field 
  const itemWithArea = {
    ...item,
    area: areaName,
    time_created: new Date().toISOString(),

    purchasePar: Number(item.purchasePar) || 0,
    areaCount: 0,
  };

  await createInventoryItem(itemWithArea);
  // Refresh items
  fetchItems();
};

  const handleEditItem = async (idx, updatedItem) => {
    const itemId = items[idx].id;
    const original = items[idx];
    // Remove 'name' from merged object before updating Firestore
    const merged = { ...original, ...updatedItem };
    if ("name" in merged) {
      delete merged.name;
    }
    await updateInventoryItem(itemId, merged);
    setEditItemIdx(null);
    fetchItems();
  };

  const handleDeleteItem = async (idx) => {
    const itemId = items[idx].id;
    await deleteInventoryItem(itemId);
    setDeleteItemIdx(null);
    fetchItems();
  };
  // Fetch items for this area
  async function fetchItems() {
    setLoading(true);
    const allItems = await getInventoryItems();
    // Map item_name to name for UI compatibility, but do not add 'name' if editing
    const mappedItems = allItems
      .filter(item => item.area === areaName)
      .map(item => ({ ...item, name: item.item_name || "" })); // Show item_name in list
    setItems(mappedItems);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaName]);

  // Sidebar and dark mode tokens
  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];
  const [activeTab, setActiveTab] = useState("inventory");
  const colorTokens = getColorTokens(darkMode);
  const sidebarBg = colorTokens.sidebarBg;
  const sidebarActiveBg = colorTokens.sidebarActiveBg;
  const sidebarHover = colorTokens.sidebarHover;
  const sidebarBorder = colorTokens.sidebarBorder;
  const logoutBg = colorTokens.logoutBg;
  // Always use white text in dark mode
  const text = darkMode ? "text-white" : colorTokens.text;
  const bg = colorTokens.bg;
  // Main card box: dark in dark mode, white in light mode
  // Match the area card color in dark mode (#393939)
  const mainCardBg = darkMode ? "bg-[#393939]" : "bg-white";
  // In dark mode, use a more distinct card background and lighter text for area items
  const cardBg = darkMode ? "bg-[#232a23]" : colorTokens.cardBg;
  const cardText = darkMode ? "text-white" : text;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className={`flex h-screen ${bg} font-sans min-w-90 transition-colors duration-200 ${darkMode ? 'text-white' : ''}`}>
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
        <h2 className={`text-center text-xl font-semibold py-5 border-b ${sidebarBorder}`}>ByteSize</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setSidebarOpen(false); router.push("/dashboard"); }}
            className={`text-left px-5 py-4 transition-colors ${activeTab === tab.id ? sidebarActiveBg : sidebarHover}`}
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
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <section>
          <div className="flex justify-center w-full">
            <div className={`${mainCardBg} rounded-xl shadow-md p-6 w-full max-w-md mx-auto my-8 md:max-w-3xl transition-colors duration-200`} style={{overflow: 'hidden'}}>
              <div className={`${darkMode ? 'bg-[#393939]' : ''} rounded-xl w-full h-full p-0 m-0`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    className={`text-2xl font-bold ${text} hover:text-[#7a926e] focus:outline-none flex items-center`}
                    onClick={() => router.push('/dashboard')}
                    aria-label="Back to Inventory"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>
                  <span className={`text-2xl font-bold ${text}`}>{areaName}</span>
                </div>
                <button
                  className={`px-4 py-2 ${sidebarActiveBg} ${text} rounded shadow hover:${sidebarHover} transition-colors`}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Item
                </button>
              </div>
              <div className="mb-6">
                <input
                  className={`${darkMode ? 'bg-[#393939] text-white border-[#555]' : 'bg-white'} ${text} w-full p-3 rounded border shadow-md focus:shadow-lg transition-shadow`}
                  type="text"
                  placeholder="Search Items"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {loading ? (
                <div className={`mb-4 ${text}`}>Loading items...</div>
              ) : filteredItems.length === 0 ? (
                <div className="mb-4">
                  <div className={`${darkMode ? 'bg-[#393939]' : cardBg} ${text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200`}>
                    No items yet.
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {filteredItems.map((item, idx) => (
                    <li key={idx}>
                      <div className={`${darkMode ? 'bg-[#414141] text-white' : cardBg + ' ' + cardText} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 transition-colors duration-200`}>
                        <span className="flex-1 font-semibold text-base">{item.name}</span>
                        {/* Enter Quantity */}
                        <div className="flex items-center gap-1 ml-1" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            maxLength={2}
                            className={`${darkMode ? 'bg-[#393939] text-white border-[#555]' : cardBg + ' ' + cardText} w-12 h-8 p-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8fa481] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-center align-middle`}
                            style={{ MozAppearance: 'textfield', marginRight: '2px' }}
                            placeholder="Qty"
                            value={(() => {
                              let v = areaCountInputs[idx];
                              if (v === undefined) v = item.areaCount;
                              if (v === undefined || v === null) return '';
                              return v;
                            })()}
                            onChange={e => handleAreaCountInputChange(idx, e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAreaCountEnter(idx); }}
                          />
                          {item.inventoryUnit && (
                            <span className={`text-xs font-bold px-1 rounded ${darkMode ? 'bg-[#414141] text-white' : cardBg + ' ' + cardText} whitespace-nowrap min-w-9 text-left align-middle`}>
                              {item.inventoryUnit}
                            </span>
                          )}
                        </div>
                        <button
                          className={`ml-1 px-2 py-1 rounded transition-colors flex items-center gap-1 ${savedStatus[idx] ? 'bg-green-500 text-white' : `${sidebarActiveBg} ${text} hover:${sidebarHover}`}`}
                          onClick={() => handleAreaCountEnter(idx)}
                          title="Enter Quantity"
                          aria-label="Enter Quantity"
                        >
                          Enter
                        </button>
                        {/* View Info */}
                        <button
                          className={`ml-2 p-2 ${darkMode ? 'bg-[#393939]' : cardBg} border border-[#b7c9a6] text-[#355b2c] rounded-full shadow hover:${darkMode ? 'bg-[#393939]' : cardBg} transition-colors flex items-center justify-center`}
                          onClick={() => setViewItem(item)}
                          title="View Info"
                          aria-label="View Info"
                        >
                          <FaInfoCircle className="w-5 h-5" />
                        </button>
                        {/* Edit Info */}
                        <button
                          className="ml-2 p-2 bg-yellow-100 text-yellow-700 rounded-full shadow hover:bg-yellow-200 transition-colors flex items-center justify-center"
                          onClick={() => setEditItemIdx(idx)}
                          title="Edit Info"
                          aria-label="Edit Info"
                        >
                          <FaPen className="w-5 h-5" />
                        </button>
                        {/* Delete */}
                        <button
                          className="ml-2 p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition-colors flex items-center justify-center"
                          onClick={() => setDeleteItemIdx(idx)}
                          title="Delete Item"
                          aria-label="Delete Item"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                        {/* Delete Confirmation Modal */}
                        {deleteItemIdx === idx && (
                          <DeleteConfirmModal
                            item={items[deleteItemIdx]}
                            onCancel={() => setDeleteItemIdx(null)}
                            onConfirm={() => handleDeleteItem(deleteItemIdx)}
                            darkMode={darkMode}
                          />
                        )}
                        {/* Edit Modal */}
                        {editItemIdx === idx && (
                          <EditItemModal
                            item={items[editItemIdx]}
                            onClose={() => setEditItemIdx(null)}
                            onSave={updated => handleEditItem(editItemIdx, updated)}
                            categories={categories}
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              </div>

              {/* Create Item Modal */}
              {showCreateModal && (
                <CreateItemModal
                  onClose={() => setShowCreateModal(false)}
                  onCreate={handleCreateItem}
                />
              )}

              {/* View Item Info Modal */}
              {viewItem && (
                <ViewItemModal itemId={viewItem.id} onClose={() => setViewItem(null)} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AreaItemListPage() {
  return (
    <DarkModeProvider>
      <AreaItemListContent />
    </DarkModeProvider>
  );
}

