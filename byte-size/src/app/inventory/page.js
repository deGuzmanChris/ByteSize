"use client";

import { useState, useEffect } from "react";
import { getInventoryItems, createInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { FaTrash } from "react-icons/fa";
import { getAreas, createArea, deleteArea } from "../../lib/areas";
import { useDarkMode } from "../../lib/DarkModeContext";
import CreateAreaModal from "../components/modals/CreateAreaModal";
import DeleteAreaModal from "../components/modals/DeleteAreaModal";
import { getColorTokens } from "../components/colorTokens";

/**
 * InventoryPage component displays all inventory areas and allows creating or deleting areas.
 */
export default function InventoryPage({ onAreaSelect }) {
  // Theme context
  const { darkMode } = useDarkMode();

  // State variables
  const [showCreateModal, setShowCreateModal] = useState(false); // Show create area modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Show delete area modal
  const [areaToDelete, setAreaToDelete] = useState(null); // Index of area to delete
  const [areas, setAreas] = useState([]); // List of area names
  const [areaDocs, setAreaDocs] = useState([]); // List of area documents (with id)
  const [loading, setLoading] = useState(true); // Loading state
  const [newAreaName, setNewAreaName] = useState(""); // New area name input
  const [creatingArea, setCreatingArea] = useState(false); // Creating area state

  // Use shared color tokens for theming
  const tokens = getColorTokens(darkMode);

  /**
   * Fetch all areas from the database and update state.
   */
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

  /**
   * Handle creating a new area.
   */
  const handleCreateArea = async (e) => {
    e.preventDefault();
    if (newAreaName.trim() === "") return;
    if (!/^[a-zA-Z\s]{1,20}$/.test(newAreaName.trim())) return;
    setCreatingArea(true);
    await createArea(newAreaName.trim());
    setNewAreaName("");
    setShowCreateModal(false);
    // Refresh area list
    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
    setCreatingArea(false);
  };

  /**
   * Handle deleting an area and all its items.
   */
  const handleDeleteArea = async (areaName) => {
    setShowDeleteModal(false);
    setAreaToDelete(null);
    // Find area doc by name
    const areaDoc = areaDocs.find(area => area.name === areaName);
    if (areaDoc) await deleteArea(areaDoc.id);
    // Delete all items in this area
    const items = await getInventoryItems();
    const itemsToDelete = items.filter(item => item.area === areaName);
    for (const item of itemsToDelete) await deleteInventoryItem(item.id);
    // Refresh area list
    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
  };

  // --- Render ---
  return (
    <section>
      {/* Header with page title and create area button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${tokens.text}`}>Inventory</h1>
        <div className="flex gap-2 items-center">
          <button
            className={`px-4 py-2 ${darkMode ? 'bg-[#8fa481] text-white hover:bg-[#7a926e]' : 'bg-[#8fa481] text-black hover:bg-[#7a926e]'} rounded shadow transition-colors`}
            onClick={() => setShowCreateModal(true)}
          >
            Create Area
          </button>
        </div>
      </div>

      {/* Loading, empty, or area list state */}
      {loading ? (
        <div className={`mb-4 ${tokens.text}`}>Loading areas...</div>
      ) : areas.length === 0 ? (
        <div className="mb-4">
          <div className={`${tokens.secondaryBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 text-base transition-colors duration-200`}>
            No areas yet.
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div
                className={`${tokens.secondaryBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer ${tokens.cardHover} transition-colors duration-200`}
                onClick={() => onAreaSelect ? onAreaSelect(area) : (window.location.href = `/area-item-list?areaName=${encodeURIComponent(area)}`)}
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
        <CreateAreaModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateArea}
          value={newAreaName}
          onChange={e => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]{0,20}$/.test(value)) setNewAreaName(value);
          }}
          creating={creatingArea}
        />
      )}

      {/* Delete Area Modal */}
      {showDeleteModal && (
        <DeleteAreaModal
          onClose={() => { setShowDeleteModal(false); setAreaToDelete(null); }}
          onDelete={() => {
            if (areaToDelete !== null) handleDeleteArea(areas[areaToDelete]);
            setShowDeleteModal(false);
            setAreaToDelete(null);
          }}
        />
      )}
    </section>
  );
}
