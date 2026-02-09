"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function InventoryPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState("");

  // Handle create area form submit
  const handleCreateArea = (e) => {
    e.preventDefault();
    if (newAreaName.trim() === "") return;
    setAreas([...areas, newAreaName.trim()]);
    setNewAreaName("");
    setShowCreateModal(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Inventory</h1>
        <button
          className="px-4 py-2 bg-[#8fa481] text-white rounded shadow hover:bg-[#7a926e] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          Create Area
        </button>
      </div>
      {areas.length === 0 ? (
        <div className="mb-4">
          <div className="bg-[#F6F0D7] rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base text-gray-400">
            No areas yet.
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div
                className="bg-[#F6F0D7] rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer hover:bg-[#e5dab6] transition-colors"
                onClick={() => window.location.href = `/area-item-list?areaName=${encodeURIComponent(area)}`}
                title={`View items in ${area}`}
              >
                <span className="flex-1 font-semibold text-base">{area}</span>
                <button
                  className="ml-4 p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition-colors flex items-center justify-center"
                  onClick={e => { e.stopPropagation(); setAreaToDelete(idx); setShowDeleteModal(true); }}
                  title="Delete Area"
                  aria-label="Delete Area"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create Area Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create Area">
          <form className="flex flex-col gap-4" onSubmit={handleCreateArea}>
            <input
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481]"
              type="text"
              placeholder="Enter area name"
              value={newAreaName}
              onChange={e => setNewAreaName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-[#d1d5db] text-black rounded hover:bg-gray-400 transition-colors" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#8fa481] text-white rounded hover:bg-[#7a926e] transition-colors">Create</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Area Modal */}
      {showDeleteModal && (
        <Modal onClose={() => { setShowDeleteModal(false); setAreaToDelete(null); }} title="Delete Area">
          <div className="mb-4">Are you sure you want to delete this area?</div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors" onClick={() => { setShowDeleteModal(false); setAreaToDelete(null); }}>Cancel</button>
            <button
              type="button"
              className="px-4 py-2 bg-[#d9534f] text-white rounded hover:bg-[#c9302c] transition-colors"
              onClick={() => {
                if (areaToDelete !== null) {
                  setAreas(areas.filter((_, idx) => idx !== areaToDelete));
                }
                setShowDeleteModal(false);
                setAreaToDelete(null);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </section>
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
