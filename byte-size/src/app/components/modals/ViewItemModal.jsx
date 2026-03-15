import { useState, useEffect } from "react";
import Modal from "../Modal.jsx";
import { getColorTokens } from "../colorTokens.js";
import { useDarkMode } from "../../../lib/DarkModeContext";
import { getInventoryItem } from "../../../lib/inventory";

export default function ViewItemModal({ itemId, onClose }) {
  const [item, setItem] = useState(null);
  const { darkMode } = useDarkMode();
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
  const text = darkMode ? "text-white" : getColorTokens(darkMode).text;
  return (
    <Modal onClose={onClose} title={item.name || item.item_name || "Item Info"} darkMode={darkMode}>
      <div className={`space-y-2 ${text}`}>
        <div><span className="font-semibold">Item ID:</span> {item.itemId || item.id || '-'} </div>
        <div><span className="font-semibold">Vendor Number:</span> {item.vendorNumber || '-'} </div>
        <div><span className="font-semibold">Category:</span> {item.category || '-'} </div>
        <div><span className="font-semibold">Inventory Unit:</span> {item.inventoryUnit || item.unit_of_measure || '-'} </div>
        <div><span className="font-semibold">Purchase Unit:</span> {item.purchaseUnit || item.container_unit || '-'} </div>
        <div><span className="font-semibold">Purchase Par:</span> {item.purchasePar || '-'} </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-[#8fa481] text-black hover:bg-[#7a926e]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
