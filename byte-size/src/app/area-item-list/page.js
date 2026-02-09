"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const tabs = [
  { id: "inventory", label: "Inventory" },
  { id: "ordering", label: "Ordering" },
  { id: "prep", label: "Prep Lists" },
  { id: "settings", label: "Settings" },
];

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
      <div className="mb-4 text-red-700 font-semibold">Are you sure you want to delete this item?</div>
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

export default function AreaItemListPage() {
  const searchParams = useSearchParams();
  const areaName = searchParams.get("areaName");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [areaCountInputs, setAreaCountInputs] = useState({});
  const [viewItem, setViewItem] = useState(null); // For viewing item info
  const [editItemIdx, setEditItemIdx] = useState(null); // For editing item
  const [deleteItemIdx, setDeleteItemIdx] = useState(null); // For confirming delete

  const handleQuantityChange = (idx, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: value } : item));
  };
  const handleAreaCountInputChange = (idx, value) => {
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: value }));
  };
  const handleAreaCountEnter = (idx) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, areaCount: areaCountInputs[idx] } : item));
    setAreaCountInputs(inputs => ({ ...inputs, [idx]: "" }));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateItem = (item) => {
    setItems([...items, item]);
  };

  const handleEditItem = (idx, updatedItem) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, ...updatedItem } : item));
    setEditItemIdx(null);
  };

  const handleDeleteItem = (idx) => {
    setItems(items => items.filter((_, i) => i !== idx));
    setDeleteItemIdx(null);
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
        {filteredItems.length === 0 ? (
          <div className="mb-8 bg-[#F6F0D7] rounded-xl shadow-md p-6 min-h-16 flex items-center">
            <span className="text-gray-400 text-base">No items yet.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredItems.map((item, idx) => (
              <li key={idx} className="bg-[#F6F0D7] rounded-xl shadow-md p-6 min-h-16 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-base" style={{ minWidth: '120px' }}>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={areaCountInputs[idx] || ""}
                      onChange={e => handleAreaCountInputChange(idx, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          handleAreaCountEnter(idx);
                        }
                      }}
                      className="w-32 p-2 rounded border text-center"
                      style={{ minWidth: '110px', height: '40px', marginRight: '8px' }}
                      placeholder="Enter quantity"
                    />
                    <label className="text-xl text-black-500 mr-2" style={{ minWidth: '40px' }}>Total:</label>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 font-medium border border-gray-300" style={{ minWidth: '110px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  {/* Delete Confirmation Modal */}
                  {deleteItemIdx !== null && (
                    <DeleteConfirmModal
                      item={items[deleteItemIdx]}
                      onCancel={() => setDeleteItemIdx(null)}
                      onConfirm={() => handleDeleteItem(deleteItemIdx)}
                    />
                  )}
                </div>
                <div className="text-gray-600 text-sm">{item.description}</div>
              </li>
            ))}
                  {/* Edit Item Modal */}
                  {editItemIdx !== null && (
                    <EditItemModal
                      item={items[editItemIdx]}
                      onClose={() => setEditItemIdx(null)}
                      onSave={updatedItem => handleEditItem(editItemIdx, updatedItem)}
                      categories={categories}
                    />
                  )}
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
          <ViewItemModal item={viewItem} onClose={() => setViewItem(null)} />
        )}
      </main>
    </div>
  );
}

function EditItemModal({ item, onClose, onSave, categories }) {
  const [form, setForm] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal onClose={onClose} title={`Edit Item: ${item.name || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="name"
              value={form.name}
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
              <option value="">Select category</option>
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

function ViewItemModal({ item, onClose }) {
  return (
    <Modal onClose={onClose} title={item.name || "Item Info"}>
      <div className="space-y-2">
        <div><span className="font-semibold">Item ID:</span> {item.itemId || '-'}</div>
        <div><span className="font-semibold">Vendor Number:</span> {item.vendorNumber || '-'}</div>
        <div><span className="font-semibold">Category:</span> {item.category || '-'}</div>
        <div><span className="font-semibold">Inventory Unit:</span> {item.inventoryUnit || '-'}</div>
        <div><span className="font-semibold">Purchase Unit:</span> {item.purchaseUnit || '-'}</div>
        <div><span className="font-semibold">Purchase Par:</span> {item.purchasePar || '-'}</div>
        <div><span className="font-semibold">Description:</span> {item.description || '-'}</div>
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
    name: "",
    itemId: "",
    vendorNumber: "",
    inventoryUnit: "",
    purchaseUnit: "",
    purchasePar: "",
    category: "",
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

  return (
    <Modal onClose={onClose} title="Create Item">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="name"
              value={form.name}
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
              <option value="">Select category</option>
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
