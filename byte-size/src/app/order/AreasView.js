"use client";

import { useState } from "react";

export default function AreasView() {
  const [areas, setAreas] = useState(["Dairy", "Bakery", "Produce"]);
  const [newArea, setNewArea] = useState("");

  function addArea(e) {
    e.preventDefault();
    const name = newArea.trim();
    if (!name) return;
    setAreas((prev) => [...prev, name]);
    setNewArea("");
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h1 className="text-2xl font-bold mb-2">Areas</h1>
      <p className="text-sm text-gray-600 mb-4">
        Create and manage areas for items.
      </p>

      <form onSubmit={addArea} className="flex gap-2 mb-4">
        <input
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          placeholder="New area name (e.g., Dairy)"
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button className="px-4 py-2 rounded bg-[#6f7f4a] text-white text-sm">
          Add
        </button>
      </form>

      <ul className="list-disc pl-5 space-y-1 text-sm">
        {areas.map((a, idx) => (
          <li key={`${a}-${idx}`}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

