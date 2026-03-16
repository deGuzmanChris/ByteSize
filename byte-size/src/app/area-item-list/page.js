"use client";

import { useState, useEffect } from "react";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItem } from "../../lib/inventory";
import { useDarkMode } from "../../lib/DarkModeContext";

const categories = [
  "Produce",
  "Protein",
  "Dry Goods",
  "Dairy",
  "Frozen",
  "Sauces",
];

function DeleteConfirmModal({ onCancel, onConfirm, darkMode }) {
  return (
    <Modal onClose={onCancel} title="Delete Item?" darkMode={darkMode}>
      <div className="mb-4">Are you sure you want to delete this item?</div>
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

export default function AreaItemListPage({ areaName, onBack }) {
  const { darkMode } = useDarkMode();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [areaCountInputs, setAreaCountInputs] = useState({});
  const [viewItem, setViewItem] = useState(null);
  const [editItemIdx, setEditItemIdx] = useState(null);
  const [deleteItemIdx, setDeleteItemIdx] = useState(null);

  const text = darkMode ? "text-[#f0f0f0]" : "text-black";
  const cardBg = darkMode ? "bg-[#3a3a3a]" : "bg-[#F6F0D7]";
  const inputCls = darkMode
    ? "w-full p-3 rounded bg-[#4a4a4a] border border-[#555] text-[#f0f0f0] shadow-md focus:shadow-lg transition-shadow"
    : "w-full p-3 rounded bg-white border shadow-md focus:shadow-lg transition-shadow";

  const handleAreaCountInputChange = (idx, value) => {
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: value }));
  };

  const handleAreaCountEnter = async (idx) => {
    const item = items[idx];
    const newCount = areaCountInputs[idx];
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: newCount } : item));
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: "" }));
    if (item.id) {
      await updateInventoryItem(item.id, { ...item, areaCount: newCount });
    }
  };

  const filteredItems = items.filter(item =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

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

  const handleEditItem = async (idx, updatedItem) => {
    const itemId = items[idx].id;
    const original = items[idx];
    const merged = { ...original, ...updatedItem };
    if ("name" in merged) delete merged.name;
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

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold cursor-pointer hover:text-[#7a926e] ${text}`}
            onClick={onBack}
          >
            Inventory
          </span>
          <span className={`text-2xl font-bold ${text}`}>&larr;</span>
          <span className={`text-2xl font-bold ${text}`}>{areaName}</span>
        </div>
        <button
          className="px-4 py-2 bg-[#89986D] text-white rounded shadow hover:bg-[#7a926e] transition"
          onClick={() => setShowCreateModal(true)}
        >
          Create Item
        </button>
      </div>

      <div className="mb-6">
        <input
          className={inputCls}
          type="text"
          placeholder="Search Items"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={`mb-8 ${cardBg} rounded-xl shadow-md p-6 min-h-16 flex items-center`}>
          <span className="text-gray-400 text-base">Loading items...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`mb-8 ${cardBg} rounded-xl shadow-md p-6 min-h-16 flex items-center`}>
          <span className="text-gray-400 text-base">No items yet.</span>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredItems.map((item, idx) => (
            <li key={idx} className={`${cardBg} rounded-xl shadow-md p-6 min-h-16 flex flex-col justify-center`}>
              <div className="flex items-center justify-between gap-4">
                <span className={`font-semibold text-base ${text}`} style={{ minWidth: '120px' }}>{item.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={areaCountInputs[idx] || ""}
                    onChange={e => handleAreaCountInputChange(idx, e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAreaCountEnter(idx); }}
                    className="w-32 p-2 rounded border text-center"
                    style={{ minWidth: '110px', height: '40px', marginRight: '8px' }}
                    placeholder="Enter quantity"
                  />
                  <label className={`text-xl mr-2 ${text}`} style={{ minWidth: '40px' }}>Total:</label>
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 font-medium border border-gray-300"
                    style={{ minWidth: '110px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.areaCount ? `${item.areaCount} ${item.inventoryUnit || ''}` : item.inventoryUnit || '-'}
                  </span>
                  <button
                    className="ml-4 px-3 py-1 bg-[#8fa481] text-white rounded hover:bg-[#7a926e] transition"
                    onClick={() => setViewItem(item)}
                  >
                    View Info
                  </button>
                  <button
                    className="ml-2 px-3 py-1 bg-[#d1b36a] text-white rounded hover:bg-[#bfa14e] transition"
                    onClick={() => setEditItemIdx(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 px-3 py-1 bg-[#e57373] text-white rounded hover:bg-[#c62828] transition"
                    onClick={() => setDeleteItemIdx(idx)}
                  >
                    Delete
                  </button>
                </div>
                {deleteItemIdx !== null && (
                  <DeleteConfirmModal
                    onCancel={() => setDeleteItemIdx(null)}
                    onConfirm={() => handleDeleteItem(deleteItemIdx)}
                    darkMode={darkMode}
                  />
                )}
              </div>
              <div className="text-gray-400 text-sm mt-1">{item.description}</div>
            </li>
          ))}
          {editItemIdx !== null && (
            <EditItemModal
              item={items[editItemIdx]}
              onClose={() => setEditItemIdx(null)}
              onSave={updatedItem => handleEditItem(editItemIdx, updatedItem)}
              categories={categories}
              darkMode={darkMode}
            />
          )}
        </ul>
      )}

      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateItem}
          darkMode={darkMode}
        />
      )}

      {viewItem && (
        <ViewItemModal itemId={viewItem.id} onClose={() => setViewItem(null)} darkMode={darkMode} />
      )}
    </section>
  );
}

function EditItemModal({ item, onClose, onSave, categories, darkMode }) {
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

  const inputCls = darkMode
    ? "w-full p-3 rounded-lg border border-[#555] bg-[#4a4a4a] text-[#f0f0f0]"
    : "w-full p-3 rounded-lg border";
  const labelCls = darkMode ? "block font-medium mb-1 text-[#f0f0f0]" : "block font-medium mb-1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal onClose={onClose} title={`Edit Item: ${form.item_name || ''}`} darkMode={darkMode}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Item Name</label>
            <input name="item_name" value={form.item_name} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Item ID</label>
            <input name="itemId" value={form.itemId} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Vendor Number</label>
            <input name="vendorNumber" value={form.vendorNumber} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-[#f0f0f0]" : ""}`}>Inventory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>Inventory Unit</label>
              <input name="inventoryUnit" placeholder="e.g. lbs, units" value={form.inventoryUnit} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Purchase Unit</label>
              <input name="purchaseUnit" placeholder="e.g. case, box" value={form.purchaseUnit} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Purchase Par</label>
              <input name="purchasePar" type="number" value={form.purchasePar} onChange={handleChange} required className={inputCls} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" className="px-6 py-2 rounded-lg bg-[#d1d5db] text-black hover:bg-gray-400" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
}

function ViewItemModal({ itemId, onClose, darkMode }) {
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
      <Modal onClose={onClose} title="Loading..." darkMode={darkMode}>
        <div>Loading item information...</div>
      </Modal>
    );
  }

  const text = darkMode ? "text-[#f0f0f0]" : "";

  return (
    <Modal onClose={onClose} title={item.name || item.item_name || "Item Info"} darkMode={darkMode}>
      <div className={`space-y-2 ${text}`}>
        <div><span className="font-semibold">Item ID:</span> {item.itemId || item.id || '-'}</div>
        <div><span className="font-semibold">Vendor Number:</span> {item.vendorNumber || '-'}</div>
        <div><span className="font-semibold">Category:</span> {item.category || '-'}</div>
        <div><span className="font-semibold">Inventory Unit:</span> {item.inventoryUnit || item.unit_of_measure || '-'}</div>
        <div><span className="font-semibold">Purchase Unit:</span> {item.purchaseUnit || item.container_unit || '-'}</div>
        <div><span className="font-semibold">Purchase Par:</span> {item.purchasePar || '-'}</div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

function CreateItemModal({ onClose, onCreate, darkMode }) {
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

  const inputCls = darkMode
    ? "w-full p-3 rounded-lg border border-[#555] bg-[#4a4a4a] text-[#f0f0f0]"
    : "w-full p-3 rounded-lg border";
  const labelCls = darkMode ? "block font-medium mb-1 text-[#f0f0f0]" : "block font-medium mb-1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Create Item" darkMode={darkMode}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Item Name</label>
            <input name="item_name" value={form.item_name} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Item ID</label>
            <input name="itemId" value={form.itemId} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Vendor Number</label>
            <input name="vendorNumber" value={form.vendorNumber} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-[#f0f0f0]" : ""}`}>Inventory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>Inventory Unit</label>
              <input name="inventoryUnit" placeholder="e.g. lbs, units" value={form.inventoryUnit} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Purchase Unit</label>
              <input name="purchaseUnit" placeholder="e.g. case, box" value={form.purchaseUnit} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Purchase Par</label>
              <input name="purchasePar" type="number" value={form.purchasePar} onChange={handleChange} required className={inputCls} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" className="px-6 py-2 rounded-lg bg-[#d1d5db] text-black hover:bg-gray-400" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-[#8fa481] text-white hover:bg-[#7a926e]">Create Item</button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({ onClose, title, children, darkMode }) {
  const backdropColor = darkMode ? "rgba(0,0,0,0.7)" : "rgba(246, 240, 215, 0.7)";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";
  const titleText = darkMode ? "text-[#f0f0f0]" : "text-black";
  const closeBtn = darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: backdropColor }}>
      <div className={`${cardBg} rounded-lg shadow-lg p-6 min-w-10 relative transition-colors duration-200`}>
        <button className={`absolute top-2 right-2 ${closeBtn} text-xl font-bold`} onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className={`text-lg font-bold mb-4 ${titleText}`}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
