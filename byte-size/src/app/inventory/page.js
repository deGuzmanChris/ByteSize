"use client";

import { useState, useEffect } from "react";
import { getInventoryItems, createInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { FaTrash } from "react-icons/fa";
import { getAreas, createArea, deleteArea } from "../../lib/areas";
import { useDarkMode } from "../../lib/DarkModeContext";

export default function InventoryPage() {
  const { darkMode } = useDarkMode();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaDocs, setAreaDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState("");

  // Dark mode color tokens
  const text = darkMode ? "text-[#f0f0f0]" : "text-black";
  const cardBg = darkMode ? "bg-[#3a3a3a]" : "bg-[#F6F0D7]";
  const cardHover = darkMode ? "hover:bg-[#4a4a4a]" : "hover:bg-[#e5dab6]";
  const inputCls = darkMode
    ? "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481] bg-[#4a4a4a] text-[#f0f0f0] border-[#555]"
    : "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8fa481]";
  const cancelBtn = darkMode
    ? "px-4 py-2 bg-[#555] text-[#f0f0f0] rounded hover:bg-[#666] transition-colors"
    : "px-4 py-2 bg-[#d1d5db] text-black rounded hover:bg-gray-400 transition-colors";

  // Fetch areas from Firestore
  useEffect(() => {
    async function fetchAreas() {
      setLoading(true);
      const areaList = await getAreas();
      setAreaDocs(areaList);
      setAreas(areaList.map(area => area.name));
      setLoading(false);
    }
    fetchAreas();
  }, []);

  const handleCreateArea = async (e) => {
    e.preventDefault();
    if (newAreaName.trim() === "") return;
    await createArea(newAreaName.trim());
    setNewAreaName("");
    setShowCreateModal(false);
    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
  };

  const handleDeleteArea = async (areaName) => {
    setShowDeleteModal(false);
    setAreaToDelete(null);
    const areaDoc = areaDocs.find(area => area.name === areaName);
    if (areaDoc) await deleteArea(areaDoc.id);
    const items = await getInventoryItems();
    const itemsToDelete = items.filter(item => item.area === areaName);
    for (const item of itemsToDelete) await deleteInventoryItem(item.id);
    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${text}`}>Inventory</h1>
        <button
          className="px-4 py-2 bg-[#8fa481] text-black rounded shadow hover:bg-[#7a926e] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          Create Area
        </button>
      </div>
      {loading ? (
        <div className={`mb-4 ${text}`}>Loading areas...</div>
      ) : areas.length === 0 ? (
        <div className="mb-4">
          <div className={`${cardBg} ${text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200`}>
            No areas yet.
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div
                className={`${cardBg} ${text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer ${cardHover} transition-colors duration-200`}
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

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create Area" darkMode={darkMode}>
          <form className="flex flex-col gap-4" onSubmit={handleCreateArea}>
            <input
              className={inputCls}
              type="text"
              placeholder="Enter area name"
              value={newAreaName}
              onChange={e => setNewAreaName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button type="button" className={cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#8fa481] text-black rounded hover:bg-[#7a926e] transition-colors">Create</button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={() => { setShowDeleteModal(false); setAreaToDelete(null); }} title="Delete Area" darkMode={darkMode}>
          <div className={`mb-4 ${text}`}>Are you sure you want to delete this area?</div>
          <div className="flex justify-end gap-2">
            <button type="button" className={cancelBtn} onClick={() => { setShowDeleteModal(false); setAreaToDelete(null); }}>Cancel</button>
            <button
              type="button"
              className="px-4 py-2 bg-[#d9534f] text-white rounded hover:bg-[#c9302c] transition-colors"
              onClick={() => {
                if (areaToDelete !== null) handleDeleteArea(areas[areaToDelete]);
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

function Modal({ onClose, title, children, darkMode }) {
  const backdropColor = darkMode ? "rgba(0,0,0,0.7)" : "rgba(246, 240, 215, 0.7)";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";
  const titleText = darkMode ? "text-[#f0f0f0]" : "text-black";
  const closeBtn = darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: backdropColor }}>
      <div className={`${cardBg} rounded-lg shadow-lg p-6 min-w-[320px] relative transition-colors duration-200`}>
        <button className={`absolute top-2 right-2 ${closeBtn} text-xl font-bold`} onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className={`text-lg font-bold mb-4 ${titleText}`}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
