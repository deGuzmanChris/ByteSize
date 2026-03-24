import { useState } from "react";
import Modal from "../Modal.jsx";
import { getColorTokens } from "../colorTokens.js";
import { useDarkMode } from "../../../lib/DarkModeContext";


export default function EditItemModal({ item, onClose, onSave, categories }) {
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

  const { darkMode } = useDarkMode();
  const colorTokens = getColorTokens(darkMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  // Sample options for units (copied from CreateItemModal)
  const inventoryUnitOptions = ["lbs", "kg", "g", "oz", "units", "pcs", "bunch", "pack", "bottle", "can"];
  const purchaseUnitOptions = ["case", "box", "bag", "carton", "bottle", "can", "pack", "tray", "roll", "dozen"];

  return (
    <Modal onClose={onClose} title={`Edit Item: ${form.item_name || ''}`} darkMode={darkMode}>
      <form onSubmit={handleSubmit} className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              required
              className={colorTokens.inputCls + " w-full"}
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Item ID</label>
            <input
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              required
              className={colorTokens.inputCls + " w-full"}
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Vendor Number</label>
            <input
              name="vendorNumber"
              value={form.vendorNumber}
              onChange={handleChange}
              className={colorTokens.inputCls + " w-full"}
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={colorTokens.selectCls + " w-full"}
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="block font-medium mb-1">Inventory Unit</label>
              <select
                name="inventoryUnit"
                value={form.inventoryUnit}
                onChange={handleChange}
                required
                className={colorTokens.selectCls + " w-full"}
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select unit</option>
                {inventoryUnitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block font-medium mb-1">Purchase Unit</label>
              <select
                name="purchaseUnit"
                value={form.purchaseUnit}
                onChange={handleChange}
                required
                className={colorTokens.selectCls + " w-full"}
              >
                <option value="" disabled hidden style={{ color: '#a3a3a3' }}>Select unit</option>
                {purchaseUnitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block font-medium mb-1">Purchase Par</label>
              <input
                name="purchasePar"
                type="number"
                value={form.purchasePar}
                onChange={handleChange}
                required
                className={colorTokens.inputCls + " w-full"}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            className={colorTokens.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={
              darkMode
                ? "px-4 py-2 bg-[#4a5c38] text-white rounded shadow hover:bg-[#3a4a2c] transition-colors"
                : "px-4 py-2 bg-[#8fa481] text-black rounded shadow hover:bg-[#7a926e] transition-colors"
            }
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
