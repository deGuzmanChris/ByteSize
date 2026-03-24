import { useState } from "react";
import Modal from "../Modal.jsx";
import { getColorTokens } from "../colorTokens.js";
import { useDarkMode } from "../../../lib/DarkModeContext";

// ✅ import filter
import { validateText } from "../../../lib/contentFilter";

export default function CreateItemModal({ onClose, onCreate, categories = [] }) {
  const [form, setForm] = useState({
    item_name: "",
    itemId: "",
    vendorNumber: "",
    category: "",
    inventoryUnit: "",
    purchaseUnit: "",
    purchasePar: "",
    time_created: new Date().toISOString(),
  });

  // ✅ error state per field
  const [errors, setErrors] = useState({});

  const { darkMode } = useDarkMode();
  const colorTokens = getColorTokens(darkMode);

  // Input limitations
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // ✅ only validate text fields
    if (["item_name", "itemId", "vendorNumber"].includes(name)) {
      const error = validateText(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ validate required text fields
    const newErrors = {
      item_name: validateText(form.item_name),
      itemId: validateText(form.itemId),
      vendorNumber: form.vendorNumber ? validateText(form.vendorNumber) : "",
    };

    setErrors(newErrors);

    // block submission if any errors
    if (Object.values(newErrors).some((err) => err)) return;

    onCreate(form);
    onClose();
  };

  const inventoryUnitOptions = ["lbs", "kg", "g", "oz", "units", "pcs", "bunch", "pack", "bottle", "can"];
  const purchaseUnitOptions = ["case", "box", "bag", "carton", "bottle", "can", "pack", "tray", "roll", "dozen"];

  return (
    <Modal onClose={onClose} title="Create Item" darkMode={darkMode}>
      <form onSubmit={handleSubmit} className={`space-y-6 ${darkMode ? 'text-white' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Item Name */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Item Name</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              required
              className={`${colorTokens.inputCls} w-full ${errors.item_name ? "border-red-500" : ""}`}
            />
            {errors.item_name && <p className="text-red-500 text-sm mt-1">{errors.item_name}</p>}
          </div>

          {/* Item ID */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Item ID</label>
            <input
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              required
              className={`${colorTokens.inputCls} w-full ${errors.itemId ? "border-red-500" : ""}`}
            />
            {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
          </div>

          {/* Vendor */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Vendor Number</label>
            <input
              name="vendorNumber"
              value={form.vendorNumber}
              onChange={handleChange}
              className={`${colorTokens.inputCls} w-full ${errors.vendorNumber ? "border-red-500" : ""}`}
            />
            {errors.vendorNumber && <p className="text-red-500 text-sm mt-1">{errors.vendorNumber}</p>}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={colorTokens.selectCls + " w-full"}
            >
              <option value="" disabled hidden>Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory section unchanged */}
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
          <button type="button" className={colorTokens.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={darkMode ? "px-4 py-2 bg-[#4a5c38] text-white rounded hover:bg-[#3a4a2c]" : "px-4 py-2 bg-[#8fa481] text-black rounded hover:bg-[#7a926e]"}>
            Create Item
          </button>
        </div>
      </form>
    </Modal>
  );
}