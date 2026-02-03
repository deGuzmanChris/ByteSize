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
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-[#8fa481] text-white rounded shadow hover:bg-[#7a926e] transition"
            onClick={() => setShowCreateModal(true)}
          >
            Create Area
          </button>
        </div>
      </div>
      {areas.length === 0 ? (
        <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6 text-gray-500">No areas yet.</div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6 flex items-center justify-between">
                <span className="flex-1">{area}</span>
                <button
                  className="ml-4 p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition flex items-center justify-center"
                  onClick={() => { setAreaToDelete(idx); setShowDeleteModal(true); }}
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
                className="border rounded p-2 w-full"
                type="text"
                placeholder="Enter area name"
                value={newAreaName}
                onChange={e => setNewAreaName(e.target.value)}
                autoFocus
              />

            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#8fa481] text-white rounded">Create</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Area Modal */}
      {showDeleteModal && (
        <Modal onClose={() => { setShowDeleteModal(false); setAreaToDelete(null); }} title="Delete Area">
          <div className="mb-4">Are you sure you want to delete this area?</div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => { setShowDeleteModal(false); setAreaToDelete(null); }}>Cancel</button>
            <button
              type="button"
              className="px-4 py-2 bg-[#d9534f] text-white rounded"
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
