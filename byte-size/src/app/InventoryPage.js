"use client";

import { useState } from "react";

export default function InventoryPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          <button
            className="px-4 py-2 bg-[#d9534f] text-white rounded shadow hover:bg-[#c9302c] transition"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Area
          </button>
        </div>
      </div>
      <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6"></div>

      {/* Create Area Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create Area">
          <form className="flex flex-col gap-4">
            <label className="font-semibold">Area Name
              <input className="border rounded p-2 w-full mt-1" type="text" placeholder="Enter area name" />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#8fa481] text-white rounded">Create</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Area Modal removed */}

      {/* Delete Area Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Delete Area">
          <div className="mb-4">Are you sure you want to delete this area?</div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button type="button" className="px-4 py-2 bg-[#d9534f] text-white rounded" onClick={() => setShowDeleteModal(false)}>Delete</button>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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
