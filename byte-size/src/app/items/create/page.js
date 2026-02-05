"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateItemPage() {
  const router = useRouter();

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
    // later: POST to API route
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F6F0D7] p-8 text-black">
      <div className="max-w-3xl mx-auto bg-[#F6F0D7] rounded-xl shadow-md p-8 text-black">
        <h1 className="text-2xl font-bold mb-6 text-black">Create Inventory Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1 text-black">Item Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-black">Item ID</label>
              <input
                name="itemId"
                value={form.itemId}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-black">Vendor Number</label>
              <input
                name="vendorNumber"
                value={form.vendorNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-black">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="border-t border-[#9CAB84] pt-6">
            <h2 className="text-lg font-semibold mb-4 text-black">Inventory Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-1 text-black">Inventory Unit</label>
                <input
                  name="inventoryUnit"
                  placeholder="e.g. lbs, units"
                  value={form.inventoryUnit}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-black">Purchase Unit</label>
                <input
                  name="purchaseUnit"
                  placeholder="e.g. case, box"
                  value={form.purchaseUnit}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-black">Purchase Par</label>
                <input
                  name="purchasePar"
                  type="number"
                  value={form.purchasePar}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-[#9CAB84] text-black bg-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg border border-[#9CAB84] text-black hover:bg-[#C5D89D]"
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
