"use client";

import { useState, useEffect } from "react";
import { FaInfoCircle, FaPen, FaTrash, FaChevronLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { getColorTokens } from "../components/colorTokens.js";
import DarkToggle from "../components/DarkToggle.jsx";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal.jsx";
import EditItemModal from "../components/modals/EditItemModal.jsx";
import ViewItemModal from "../components/modals/ViewItemModal.jsx";
import CreateItemModal from "../components/modals/CreateItemModal.jsx";
import { useDarkMode } from "../../lib/DarkModeContext";

// List of item categories
const categories = [
  "Produce",
  "Protein",
  "Dry Goods",
  "Dairy",
  "Frozen",
  "Sauces",
];

/**
 * Main component for displaying and managing items in a specific area.
 */
function AreaItemListContent() {
  // Context and navigation hooks
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaName = searchParams.get("areaName");

  // State variables
  const [showCreateModal, setShowCreateModal] = useState(false); // Show create item modal
  const [items, setItems] = useState([]); // List of items in this area
  const [loading, setLoading] = useState(true); // Loading state
  const [search, setSearch] = useState(""); // Search input
  const [areaCountInputs, setAreaCountInputs] = useState({}); // Per-item quantity input
  const [savedStatus, setSavedStatus] = useState({}); // Per-item save indicator
  const [viewItem, setViewItem] = useState(null); // Item to view in modal
  const [editItemIdx, setEditItemIdx] = useState(null); // Index of item to edit
  const [deleteItemIdx, setDeleteItemIdx] = useState(null); // Index of item to delete
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [activeTab, setActiveTab] = useState("inventory"); // Sidebar tab

  // Color tokens for theming
  const colorTokens = getColorTokens(darkMode);
  const sidebarBg = colorTokens.sidebarBg;
  const sidebarActiveBg = colorTokens.sidebarActiveBg;
  const sidebarHover = colorTokens.sidebarHover;
  const sidebarBorder = colorTokens.sidebarBorder;
  const logoutBg = colorTokens.logoutBg;
  const text = darkMode ? "text-white" : colorTokens.text;
  const bg = colorTokens.bg;
  const mainCardBg = colorTokens.cardBg;
  const cardBg = colorTokens.secondaryBg;
  const cardText = darkMode ? "text-white" : text;

  // Sidebar navigation tabs
  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "ordering", label: "Ordering" },
    { id: "prep", label: "Prep Lists" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  /**
   * Fetch all items for the current area from the database.
   */
  async function fetchItems() {
    setLoading(true);
    const allItems = await getInventoryItems();
    // Map Firestore 'item_name' to 'name' for UI
    const mappedItems = allItems
      .filter(item => item.area === areaName)
      .map(item => ({ ...item, name: item.item_name || "" }));
    setItems(mappedItems);
    setLoading(false);
  }

  // Fetch items when areaName changes
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaName]);

  /**
   * Handle input change for per-item quantity (areaCount).
   * Only allow numbers or empty string, max 2 digits.
   */
  const handleAreaCountInputChange = (idx, value) => {
    if ((value === "" || /^\d+$/.test(value)) && value.length <= 2) {
      setAreaCountInputs(inputs => ({ ...inputs, [idx]: value }));
    }
  };

  /**
   * Save the entered quantity for an item and show a save indicator.
   */
  const handleAreaCountEnter = async (idx) => {
    const item = items[idx];
    let newCount = areaCountInputs[idx];
    if (newCount === undefined || newCount === null) return;
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: newCount } : item));
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: newCount }));
    if (item.id) {
      await updateInventoryItem(item.id, { ...item, areaCount: newCount });
      setSavedStatus(status => ({ ...status, [idx]: true }));
      setTimeout(() => {
        setSavedStatus(status => ({ ...status, [idx]: false }));
      }, 1200);
      // Reset input if cleared
      if (newCount === "") {
        setAreaCountInputs(inputs => ({ ...inputs, [idx]: undefined }));
        setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: "" } : item));
      }
    }
  };

  /**
   * Filter items by search string (case-insensitive).
   */
  const filteredItems = items.filter(item =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Create a new item in this area.
   */
  const handleCreateItem = async (item) => {
    const itemWithArea = {
      ...item,
      area: areaName,
      time_created: new Date().toISOString(),
      purchasePar: Number(item.purchasePar) || 0,
      areaCount: 0,
    };
    await createInventoryItem(itemWithArea);
    fetchItems();
  };

  /**
   * Edit an existing item (except for name).
   */
  const handleEditItem = async (idx, updatedItem) => {
    const itemId = items[idx].id;
    const original = items[idx];
    const merged = { ...original, ...updatedItem };
    if ("name" in merged) {
      delete merged.name;
    }
    await updateInventoryItem(itemId, merged);
    setEditItemIdx(null);
    fetchItems();
  };

  /**
   * Delete an item from the area.
   */
  const handleDeleteItem = async (idx) => {
    const itemId = items[idx].id;
    await deleteInventoryItem(itemId);
    setDeleteItemIdx(null);
    fetchItems();
  };

  /**
   * Log out the user and redirect to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // --- Render ---
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

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar navigation */}
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

      {/* Main content area */}
      <main className="flex-1">
        <section>
          <div className="flex justify-center w-full">
            <div className={`${mainCardBg} rounded-xl shadow-md p-6 w-full max-w-md mx-auto my-8 md:max-w-3xl transition-colors duration-200`} style={{overflow: 'hidden'}}>
              <div className={`rounded-xl w-full h-full p-0 m-0`}>
                {/* Header with area name and create item button */}
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
                    className={`px-4 py-2 ${darkMode ? 'bg-[#8fa481] text-white hover:bg-[#7a926e]' : 'bg-[#8fa481] text-black hover:bg-[#7a926e]'} rounded shadow transition-colors`}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Item
                  </button>
                </div>

                {/* Search bar */}
                <div className="mb-6">
                  <input
                    className={`${darkMode ? 'bg-[#393939] text-white border-[#555]' : 'bg-white'} ${text} w-full p-3 rounded border shadow-md focus:shadow-lg transition-shadow`}
                    type="text"
                    placeholder="Search Items"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                {/* Item list or loading/empty state */}
                {loading ? (
                  <div className={`mb-4 ${text}`}>Loading items...</div>
                ) : filteredItems.length === 0 ? (
                  <div className="mb-4">
                    <div className={`${cardBg} ${text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200`}>
                      No items yet.
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {filteredItems.map((item, idx) => (
                      <li key={idx}>
                        <div className={`${cardBg} ${cardText} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 transition-colors duration-200`}>
                          <span className="flex-1 font-semibold text-base">{item.name}</span>
                          {/* Quantity input and save button */}
                          <div className="flex items-center gap-1 ml-1" style={{ minWidth: '100px' }}>
                            <input
                              type="number"
                              maxLength={2}
                              className={`${mainCardBg} ${darkMode ? 'text-white' : 'text-black'} border-[#555] w-12 h-8 p-1 rounded border focus:outline-none focus:ring-2 focus:ring-[#8fa481] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-center align-middle placeholder:opacity-60 placeholder:font-semibold`} 
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
                              <span className={`text-xs font-bold px-1 rounded ${darkMode ? cardBg + ' text-white' : cardBg + ' text-black'} whitespace-nowrap min-w-9 text-left align-middle`}>
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
                          {/* View item info button */}
                          <button
                            className={`ml-2 p-2 ${mainCardBg} border border-[#b7c9a6] text-[#355b2c] rounded-full shadow hover:${mainCardBg} transition-colors flex items-center justify-center`}
                            onClick={() => setViewItem(item)}
                            title="View Info"
                            aria-label="View Info"
                          >
                            <FaInfoCircle className="w-5 h-5" />
                          </button>
                          {/* Edit item button */}
                          <button
                            className="ml-2 p-2 bg-yellow-100 text-yellow-700 rounded-full shadow hover:bg-yellow-200 transition-colors flex items-center justify-center"
                            onClick={() => setEditItemIdx(idx)}
                            title="Edit Info"
                            aria-label="Edit Info"
                          >
                            <FaPen className="w-5 h-5" />
                          </button>
                          {/* Delete item button */}
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
                  categories={categories}
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

export default AreaItemListContent;
