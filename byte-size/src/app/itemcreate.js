"use client";

import { useState } from "react";

export default function CreateItemPage() {
  const [form, setForm] = useState({
    name: "",
    itemId: "",
    vendorNumber: "",
    inventoryUnit: "",
    purchaseUnit: "",
    purchasePar: "",
    category: "",
  });

  const categories = [
    "Produce",
    "Protein",
    "Dry Goods",
    "Dairy",
    "Frozen",
    "Sauces",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Item Created:", form);
    // later connect to backend
  };

  return (
    <div className="min-h-screen bg-[#F6F0D7] p-8">
      <div className="max-w-3xl mx-auto bg-[#F6F0D7] rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Create Inventory Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Item Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Item ID</label>
              <input
                name="itemId"
                value={form.itemId}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Vendor Number</label>
              <input
                name="vendorNumber"
                value={form.vendorNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Inventory Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-1">Inventory Unit</label>
                <input
                  name="inventoryUnit"
                  placeholder="e.g. lbs, units"
                  value={form.inventoryUnit}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Purchase Unit</label>
                <input
                  name="purchaseUnit"
                  placeholder="e.g. case, box"
                  value={form.purchaseUnit}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Purchase Par</label>
                <input
                  name="purchasePar"
                  type="number"
                  value={form.purchasePar}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="reset"
              className="px-6 py-2 rounded-lg border border-[#9CAB84]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#89986D] text-[#F6F0D7] hover:opacity-90"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
