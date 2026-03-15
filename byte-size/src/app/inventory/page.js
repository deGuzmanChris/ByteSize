
"use client";

import { useState, useEffect } from "react";
import { getInventoryItems, createInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { FaTrash } from "react-icons/fa";
import { getAreas, createArea, deleteArea } from "../../lib/areas";
import { useDarkMode } from "../../lib/DarkModeContext";
import DarkToggle from "../components/DarkToggle";
import Modal from "../components/Modal";
import { getColorTokens } from "../components/colorTokens";


export default function InventoryPage() {
  const { darkMode } = useDarkMode();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaDocs, setAreaDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState("");
  const [creatingArea, setCreatingArea] = useState(false);

  // Use shared color tokens
  const tokens = getColorTokens(darkMode);

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
    if (!/^[a-zA-Z\s]{1,20}$/.test(newAreaName.trim())) return;
    setCreatingArea(true);
    await createArea(newAreaName.trim());
    setNewAreaName("");
    setShowCreateModal(false);
    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
    setCreatingArea(false);
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
        <h1 className={`text-2xl font-bold ${tokens.text}`}>Inventory</h1>
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 bg-[#8fa481] text-black rounded shadow hover:bg-[#7a926e] transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            Create Area
          </button>
        </div>
      </div>
      {loading ? (
        <div className={`mb-4 ${tokens.text}`}>Loading areas...</div>
      ) : areas.length === 0 ? (
        <div className="mb-4">
          <div className={`${tokens.cardBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200`}>
            No areas yet.
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div
                className={`${tokens.cardBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer ${tokens.cardHover} transition-colors duration-200`}
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
          <form className="flex flex-col gap-3" onSubmit={handleCreateArea}>
            <input
              className={tokens.inputCls}
              type="text"
              placeholder="Enter area name"
              value={newAreaName}
              onChange={e => {
                // Only allow letters and spaces, and max 20 characters
                const value = e.target.value;
                if (/^[a-zA-Z\s]{0,20}$/.test(value)) setNewAreaName(value);
              }}
              maxLength={20}
              autoFocus
            />
            <div className="text-xs text-gray-500 mt-1 text-left">Max 20 characters</div>
            <div className="flex justify-end gap-2">
              <button type="button" className={tokens.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8fa481] text-black rounded hover:bg-[#7a926e] transition-colors"
                disabled={creatingArea}
              >
                {creatingArea ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={() => { setShowDeleteModal(false); setAreaToDelete(null); }} title="Delete Area" darkMode={darkMode}>
          <div className={`mb-4 ${tokens.text}`}>Are you sure you want to delete this area?</div>
          <div className="flex justify-end gap-2">
            <button type="button" className={tokens.cancelBtn} onClick={() => { setShowDeleteModal(false); setAreaToDelete(null); }}>Cancel</button>
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

