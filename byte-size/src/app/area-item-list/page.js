"use client";

import { useState, useEffect, Suspense } from "react";
import { FaInfoCircle, FaPen, FaTrash, FaChevronLeft, FaEllipsisV } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { getColorTokens } from "../components/colorTokens.js";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal.jsx";
import EditItemModal from "../components/modals/EditItemModal.jsx";
import ViewItemModal from "../components/modals/ViewItemModal.jsx";
import CreateItemModal from "../components/modals/CreateItemModal.jsx";
import { useDarkMode } from "../../lib/DarkModeContext";

const categories = ["Produce", "Protein", "Dry Goods", "Dairy", "Frozen", "Sauces"];

/**
 * Content-only component — no sidebar or page shell.
 * Receives areaName and onBack as props so it can be embedded in the dashboard.
 */
export function AreaItemList({ areaName, onBack }) {
  const { darkMode } = useDarkMode();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Handler to limit search input: max 30 chars, only alphanumeric and spaces
  const handleSearchChange = (e) => {
    let value = e.target.value;
    // Only allow alphanumeric and spaces
    value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    // Limit to 30 characters
    if (value.length > 30) value = value.slice(0, 30);
    setSearch(value);
  };
  const [areaCountInputs, setAreaCountInputs] = useState({});
  const [savedStatus, setSavedStatus] = useState({});
  const [viewItem, setViewItem] = useState(null);
  const [editItemIdx, setEditItemIdx] = useState(null);
  const [deleteItemIdx, setDeleteItemIdx] = useState(null);
  const [openActionMenuIdx, setOpenActionMenuIdx] = useState(null);

  const colorTokens = getColorTokens(darkMode);
  const sidebarActiveBg = colorTokens.sidebarActiveBg;
  const text = darkMode ? "text-white" : colorTokens.text;
  const mainCardBg = colorTokens.cardBg;
  const cardBg = colorTokens.secondaryBg;
  const cardText = darkMode ? "text-white" : text;

  async function fetchItems() {
    setLoading(true);
    const allItems = await getInventoryItems();
    const mappedItems = allItems
      .filter(item => item.area === areaName)
      .map(item => ({ ...item, name: item.item_name || "" }));
    setItems(mappedItems);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaName]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest("[data-area-item-actions]")) {
        setOpenActionMenuIdx(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleAreaCountInputChange = (idx, value) => {
    if ((value === "" || /^\d+$/.test(value)) && value.length <= 2) {
      setAreaCountInputs(inputs => ({ ...inputs, [idx]: value }));
    }
  };

  const handleAreaCountEnter = async (idx) => {
    const item = items[idx];
    let newCount = areaCountInputs[idx];
    if (newCount === undefined || newCount === null) return;
    setItems(items => items.map((it, i) => i === idx ? { ...it, areaCount: newCount } : it));
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: newCount }));
    if (item.id) {
      await updateInventoryItem(item.id, { ...item, areaCount: newCount });
      setSavedStatus(status => ({ ...status, [idx]: true }));
      setTimeout(() => setSavedStatus(status => ({ ...status, [idx]: false })), 1200);
      if (newCount === "") {
        setAreaCountInputs(inputs => ({ ...inputs, [idx]: undefined }));
        setItems(items => items.map((it, i) => i === idx ? { ...it, areaCount: "" } : it));
      }
    }
  };

  const filteredItems = items.filter(item =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateItem = async (item) => {
    // Prevent duplicate item names within the same area (case-insensitive)
    if (items.some(existing => (existing.name || "").toLowerCase() === (item.item_name || "").toLowerCase())) {
      alert("An item with this name already exists in this area.");
      return;
    }
    await createInventoryItem({
      ...item,
      area: areaName,
      time_created: new Date().toISOString(),
      purchasePar: Number(item.purchasePar) || 0,
      areaCount: 0,
    });
    fetchItems();
  };

  const handleEditItem = async (idx, updatedItem) => {
    const itemId = items[idx].id;
    const merged = { ...items[idx], ...updatedItem };
    delete merged.name;
    await updateInventoryItem(itemId, merged);
    setOpenActionMenuIdx(null);
    setEditItemIdx(null);
    fetchItems();
  };

  const handleDeleteItem = async (idx) => {
    await deleteInventoryItem(items[idx].id);
    setOpenActionMenuIdx(null);
    setDeleteItemIdx(null);
    fetchItems();
  };

  return (
    <section>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-2">
          <button
            className={`${text} hover:text-[#7a926e] focus:outline-none flex items-center`}
            onClick={onBack}
            aria-label="Back to Inventory"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <span className={`text-2xl font-bold ${text}`}>{areaName}</span>
        </div>
        <button
          className={`rounded-lg font-semibold px-4 py-2 ${darkMode
              ? "bg-[#8fa481] text-white hover:bg-[#7a926e]"
              : "bg-[#8fa481] text-black hover:bg-[#7a926e]"
            } rounded shadow transition-colors`}
          onClick={() => setShowCreateModal(true)}
        >
          Create Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          className={`${darkMode ? "bg-[#393939] text-white border-[#555]" : "bg-white"} ${text} w-full p-3 rounded border shadow-md focus:shadow-lg transition-shadow`}
          type="text"
          placeholder="Search Items"
          value={search}
          onChange={handleSearchChange}
          maxLength={30}
          pattern="[a-zA-Z0-9 ]*"
          title="Only letters, numbers, and spaces allowed. Max 30 characters."
        />
      </div>

      {/* Item list */}
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
              <div className={`${cardBg} ${cardText} rounded-xl shadow-md flex items-center min-h-18 h-18 px-4 gap-2 transition-colors duration-200`}>
                <span
                  className="flex-1 min-w-0 font-semibold text-base truncate"
                  title={item.name}
                >
                  {item.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    maxLength={2}
                    className={`${mainCardBg} ${darkMode ? "text-white" : "text-black"} border-[#555] w-10 h-7 p-1 rounded border focus:outline-none focus:ring-2 focus:ring-[#8fa481] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-center placeholder:opacity-60 placeholder:font-semibold`}
                    style={{ MozAppearance: "textfield" }}
                    placeholder="Qty"
                    value={(() => {
                      let v = areaCountInputs[idx];
                      if (v === undefined) v = item.areaCount;
                      if (v === undefined || v === null) return "";
                      return v;
                    })()}
                    onChange={e => handleAreaCountInputChange(idx, e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAreaCountEnter(idx); }}
                  />
                  <span className={`text-xs font-bold px-1 rounded ${darkMode ? cardBg + " text-white" : cardBg + " text-black"} whitespace-nowrap w-10 text-left mr-1`}>
                    {item.inventoryUnit || ""}
                  </span>
                  <button
                    className={`px-2 py-1 rounded transition-colors text-sm mr-1 ${savedStatus[idx] ? "bg-green-500 text-white" : `${sidebarActiveBg} ${text}`}`}
                    onClick={() => handleAreaCountEnter(idx)}
                    title="Enter Quantity"
                  >
                    Enter
                  </button>
                  <div className="relative sm:hidden" data-area-item-actions>
                    <button
                      className={`p-1.5 ${mainCardBg} border border-[#b7c9a6] ${text} rounded-full shadow transition-colors flex items-center justify-center`}
                      onClick={() => setOpenActionMenuIdx(current => current === idx ? null : idx)}
                      title="More Actions"
                      aria-label={`More actions for ${item.name}`}
                      aria-expanded={openActionMenuIdx === idx}
                    >
                      <FaEllipsisV className="w-4 h-4" />
                    </button>
                    {openActionMenuIdx === idx && (
                      <div
                        className={`${mainCardBg} absolute right-0 top-full z-20 mt-2 rounded-xl border border-[#b7c9a6] p-1 shadow-lg`}
                      >
                        <button
                          className={`flex w-full items-center justify-center rounded-lg p-2 text-sm transition-colors ${text} ${darkMode ? "hover:bg-[#4a4a4a]" : "hover:bg-[#f1edd8]"}`}
                          onClick={() => {
                            setOpenActionMenuIdx(null);
                            setViewItem(item);
                          }}
                          title="View Info"
                          aria-label={`View info for ${item.name}`}
                        >
                          <FaInfoCircle className="w-4 h-4 text-[#355b2c]" />
                        </button>
                        <button
                          className={`flex w-full items-center justify-center rounded-lg p-2 text-sm transition-colors ${text} ${darkMode ? "hover:bg-[#4a4a4a]" : "hover:bg-[#f1edd8]"}`}
                          onClick={() => {
                            setOpenActionMenuIdx(null);
                            setEditItemIdx(idx);
                          }}
                          title="Edit Info"
                          aria-label={`Edit ${item.name}`}
                        >
                          <FaPen className="w-4 h-4 text-yellow-700" />
                        </button>
                        <button
                          className={`flex w-full items-center justify-center rounded-lg p-2 text-sm transition-colors ${darkMode ? "text-red-300 hover:bg-[#4a4a4a]" : "text-[#b33b37] hover:bg-[#fce4e3]"}`}
                          onClick={() => {
                            setOpenActionMenuIdx(null);
                            setDeleteItemIdx(idx);
                          }}
                          title="Delete Item"
                          aria-label={`Delete ${item.name}`}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="hidden items-center gap-1 sm:flex">
                    <button
                      className={`p-2 ${mainCardBg} border border-[#b7c9a6] text-[#355b2c] rounded-full shadow transition-colors flex items-center justify-center`}
                      onClick={() => setViewItem(item)}
                      title="View Info"
                      aria-label={`View info for ${item.name}`}
                    >
                      <FaInfoCircle className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-full shadow hover:bg-yellow-200 transition-colors flex items-center justify-center"
                      onClick={() => setEditItemIdx(idx)}
                      title="Edit Info"
                      aria-label={`Edit ${item.name}`}
                    >
                      <FaPen className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition-colors flex items-center justify-center"
                      onClick={() => setDeleteItemIdx(idx)}
                      title="Delete Item"
                      aria-label={`Delete ${item.name}`}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {deleteItemIdx === idx && (
                  <DeleteConfirmModal
                    item={items[deleteItemIdx]}
                    onCancel={() => setDeleteItemIdx(null)}
                    onConfirm={() => handleDeleteItem(deleteItemIdx)}
                    darkMode={darkMode}
                  />
                )}
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

      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateItem}
          categories={categories}
        />
      )}
      {viewItem && (
        <ViewItemModal itemId={viewItem.id} onClose={() => setViewItem(null)} />
      )}
    </section>
  );
}

/**
 * Default export: page wrapper for direct URL access (/area-item-list?areaName=X).
 * Reads props from the URL and delegates to the content component.
 */
function AreaItemListPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaName = searchParams.get("areaName");
  return <AreaItemList areaName={areaName} onBack={() => router.push("/dashboard")} />;
}

export default function AreaItemListPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AreaItemListPageInner />
    </Suspense>
  );
}
