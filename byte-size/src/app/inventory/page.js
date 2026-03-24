"use client";

import { useState, useEffect } from "react";
import { getInventoryItems, createInventoryItem, deleteInventoryItem } from "../../lib/inventory";
import { FaTrash } from "react-icons/fa";
import { getAreas, createArea, deleteArea } from "../../lib/areas";
import { useDarkMode } from "../../lib/DarkModeContext";
import CreateAreaModal from "../components/modals/CreateAreaModal";
import DeleteAreaModal from "../components/modals/DeleteAreaModal";
import { getColorTokens } from "../components/colorTokens";
import { validateText } from "../../lib/contentFilter";

/**
 * InventoryPage component displays all inventory areas and allows creating or deleting areas.
 */
export default function InventoryPage({ onAreaSelect }) {
  const { darkMode } = useDarkMode();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  const [areas, setAreas] = useState([]);
  const [areaDocs, setAreaDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAreaName, setNewAreaName] = useState("");
  const [creatingArea, setCreatingArea] = useState(false);

  // ✅ Inline error state
  const [error, setError] = useState("");

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

  /**
   * Handle creating a new area.
   */
  const handleCreateArea = async (e) => {
    e.preventDefault();

    const trimmed = newAreaName.trim();

    // keep your regex rule
    if (!/^[a-zA-Z\s]{1,20}$/.test(trimmed)) {
      setError("Only letters allowed (max 20 characters).");
      return;
    }

    // ✅ Use shared filter
    const validationError = validateText(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setCreatingArea(true);

    await createArea(trimmed);

    setNewAreaName("");
    setShowCreateModal(false);

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

    const areaDoc = areaDocs.find(area => area.name === areaName);
    if (areaDoc) await deleteArea(areaDoc.id);

    const items = await getInventoryItems();
    const itemsToDelete = items.filter(item => item.area === areaName);

    for (const item of itemsToDelete) {
      await deleteInventoryItem(item.id);
    }

    const areaList = await getAreas();
    setAreaDocs(areaList);
    setAreas(areaList.map(area => area.name));
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${tokens.text}`}>Inventory</h1>

        <div className="flex gap-2 items-center">
          <button
            className={`rounded-lg font-semibold px-4 py-2 ${
              darkMode
                ? "bg-[#8fa481] text-white hover:bg-[#7a926e]"
                : "bg-[#8fa481] text-black hover:bg-[#7a926e]"
            } rounded shadow transition-colors`}
            onClick={() => setShowCreateModal(true)}
          >
            Create Area
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={`mb-4 ${tokens.text}`}>Loading areas...</div>
      ) : areas.length === 0 ? (
        <div className="mb-4">
          <div className={`${tokens.secondaryBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6`}>
            No areas yet.
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {areas.map((area, idx) => (
            <li key={idx}>
              <div
                className={`${tokens.secondaryBg} ${tokens.text} rounded-xl shadow-md flex items-center min-h-18 h-18 px-6 cursor-pointer ${tokens.cardHover} transition-colors duration-200`}
                onClick={() =>
                  onAreaSelect
                    ? onAreaSelect(area)
                    : (window.location.href = `/area-item-list?areaName=${encodeURIComponent(area)}`)
                }
                title={`View items in ${area}`}
              >
                <span className="flex-1 font-semibold text-base">{area}</span>

                <button
                  className="ml-4 p-2 bg-[#d9534f] text-white rounded-full shadow hover:bg-[#c9302c] transition-colors flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAreaToDelete(idx);
                    setShowDeleteModal(true);
                  }}
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
          onClose={() => {
            setShowCreateModal(false);
            setError("");
          }}
          onSubmit={handleCreateArea}
          value={newAreaName}
          error={error} // ✅ pass error down
          onChange={(e) => {
            const value = e.target.value;

            if (!/^[a-zA-Z\s]{0,20}$/.test(value)) return;

            setNewAreaName(value);

            // ✅ live validation using shared filter
            const validationError = validateText(value);
            setError(validationError);
          }}
          creating={creatingArea}
        />
      )}

      {/* Delete Area Modal */}
      {showDeleteModal && (
        <DeleteAreaModal
          onClose={() => {
            setShowDeleteModal(false);
            setAreaToDelete(null);
          }}
          onDelete={() => {
            if (areaToDelete !== null) {
              handleDeleteArea(areas[areaToDelete]);
            }
            setShowDeleteModal(false);
            setAreaToDelete(null);
          }}
        />
      )}
    </section>
  );
}