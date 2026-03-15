"use client";

import { useState, useEffect } from "react";
import { FaInfoCircle, FaPen, FaTrash, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItem } from "../../lib/inventory";
import { useSearchParams } from "next/navigation";

const categories = [
  "Produce",
  "Protein",
  "Dry Goods",
  "Dairy",
  "Frozen",
  "Sauces",
];

function DeleteConfirmModal({ item, onCancel, onConfirm }) {
  return (
    <Modal onClose={onCancel} title="Delete Item?">
      <div className="mb-4 ">Are you sure you want to delete this item?</div>
      <div className="flex justify-end gap-4">
        <button
          className="px-6 py-2 rounded-lg bg-[#d1d5db] text-black hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-[#e57373] text-white hover:bg-[#c62828]"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}


import { DarkModeProvider, useDarkMode } from "../../lib/DarkModeContext";

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
  const sidebarBg = darkMode ? "bg-[#4a5c38]" : "bg-[#89986D]";
  const sidebarActiveBg = darkMode ? "bg-[#3a4a2c]" : "bg-[#9CAB84]";
  const sidebarHover = darkMode ? "hover:bg-[#3a4a2c]/70" : "hover:bg-[#9CAB84]/70";
  const sidebarBorder = darkMode ? "border-[#3a4a2c]" : "border-[#9CAB84]";
  const logoutBg = darkMode ? "bg-[#3a4a2c] hover:bg-[#2e3b22]" : "bg-[#7C8A5F] hover:bg-[#6E7B54]";
  const text = darkMode ? "text-[#f0f0f0]" : "text-black";
  const bg = darkMode ? "bg-[#1e1e1e]" : "bg-[#F6F0D7]";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className={`flex h-screen ${bg} font-sans min-w-90 transition-colors duration-200`}>
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
          <DarkToggle />
        </div>
        <button onClick={handleLogout} className={`px-5 py-4 text-left transition-colors ${logoutBg}`}>
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <section>
          <div className="flex justify-center w-full">
              <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md mx-auto my-8 md:max-w-3xl transition-colors duration-200" style={{overflow: 'hidden'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-2xl text-black hover:text-[#7a926e] focus:outline-none flex items-center"
                      onClick={() => router.push('/dashboard')}
                      aria-label="Back to Inventory"
                    >
                      <FaChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-2xl font-bold text-black">{areaName}</span>
                  </div>
                  <button
                    className="px-4 py-2 bg-[#8fa481] text-black rounded shadow hover:bg-[#7a926e] transition-colors"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Item
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
              {loading ? (
                <div className="mb-4 text-black">Loading items...</div>
              ) : filteredItems.length === 0 ? (
                <div className="mb-4">
                  <div className="bg-[#F6F0D7] text-black rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200">
                    No items yet.
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {filteredItems.map((item, idx) => (
                    <li key={idx}>
                      <div className="bg-[#F6F0D7] text-black rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 transition-colors duration-200">
                        <span className="flex-1 font-semibold text-base">{item.name}</span>
                        {/* Enter Quantity */}
                        <div className="flex items-center gap-1 ml-1" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            maxLength={2}
                            className="w-12 h-8 p-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8fa481] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-center align-middle"
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
                            <span className="text-xs font-bold px-1 rounded bg-[#F6F0D7] whitespace-nowrap min-w-[36px] text-left align-middle">
                              {item.inventoryUnit}
                            </span>
                          )}
                        </div>
                        <button
                          className={`ml-1 px-2 py-1 rounded transition-colors flex items-center gap-1 ${savedStatus[idx] ? 'bg-green-500 text-white' : 'bg-[#8fa481] text-black hover:bg-[#7a926e]'}`}
                          onClick={() => handleAreaCountEnter(idx)}
                          title="Enter Quantity"
                          aria-label="Enter Quantity"
                        >
                          Enter
                        </button>
                        {/* View Info */}
                        <button
                          className="ml-2 p-2 bg-white border border-[#b7c9a6] text-[#355b2c] rounded-full shadow hover:bg-[#f6f0d7] transition-colors flex items-center justify-center"
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

function EditItemModal({ item, onClose, onSave, categories }) {
  const [form, setForm] = useState({
    itemId: item.itemId || item.id || "",
    item_name: item.item_name || "",
    vendorNumber: item.vendorNumber || "",
    category: item.category || "",
    inventoryUnit: item.inventoryUnit || "",
    purchaseUnit: item.purchaseUnit || "",
    purchasePar: item.purchasePar || "",
    time_created: item.time_created || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal onClose={onClose} title={`Edit Item: ${form.item_name || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Item ID</label>
            <input
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Vendor Number</label>
            <input
              name="vendorNumber"
              value={form.vendorNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-1">Inventory Unit</label>
              <input
                name="inventoryUnit"
                placeholder="e.g. lbs, units"
                value={form.inventoryUnit}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Purchase Unit</label>
              <input
                name="purchaseUnit"
                placeholder="e.g. case, box"
                value={form.purchaseUnit}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Purchase Par</label>
              <input
                name="purchasePar"
                type="number"
                value={form.purchasePar}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-[#d1d5db] text-black hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ViewItemModal({ itemId, onClose }) {
  const [item, setItem] = useState(null);
  useEffect(() => {
    async function fetchItem() {
      const fetched = await getInventoryItem(itemId);
      setItem(fetched);
    }
    fetchItem();
  }, [itemId]);
  if (!item) {
    return (
      <Modal onClose={onClose} title="Loading...">
        <div>Loading item information...</div>
      </Modal>
    );
  }
  return (
    <Modal onClose={onClose} title={item.name || item.item_name || "Item Info"}>
      <div className="space-y-2">
        <div><span className="font-semibold">Item ID:</span> {item.itemId || item.id || '-'} </div>
        <div><span className="font-semibold">Vendor Number:</span> {item.vendorNumber || '-'} </div>
        <div><span className="font-semibold">Category:</span> {item.category || '-'} </div>
        <div><span className="font-semibold">Inventory Unit:</span> {item.inventoryUnit || item.unit_of_measure || '-'} </div>
        <div><span className="font-semibold">Purchase Unit:</span> {item.purchaseUnit || item.container_unit || '-'} </div>
        <div><span className="font-semibold">Purchase Par:</span> {item.purchasePar || '-'} </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

function CreateItemModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    item_name: "",
    itemId: "",
    vendorNumber: "",
    category: "",
    inventoryUnit: "",
    purchaseUnit: "",
    purchasePar: "",
    time_created: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    onClose();
  };

  // Sample options for units
  const inventoryUnitOptions = ["lbs", "kg", "g", "oz", "units", "pcs", "bunch", "pack", "bottle", "can"];
  const purchaseUnitOptions = ["case", "box", "bag", "carton", "bottle", "can", "pack", "tray", "roll", "dozen"];

  return (
    <Modal onClose={onClose} title="Create Item">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Item ID</label>
            <input
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Vendor Number</label>
            <input
              name="vendorNumber"
              value={form.vendorNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-1">Inventory Unit</label>
              <select
                name="inventoryUnit"
                value={form.inventoryUnit}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select unit</option>
                {inventoryUnitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Purchase Unit</label>
              <select
                name="purchaseUnit"
                value={form.purchaseUnit}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select unit</option>
                {purchaseUnitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Purchase Par</label>
              <input
                name="purchasePar"
                type="number"
                value={form.purchasePar}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-[#d1d5db] text-black hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]"
          >
            Create Item
          </button>
        </div>
      </form>
    </Modal>
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
