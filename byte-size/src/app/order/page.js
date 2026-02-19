"use client";

import { useEffect, useMemo, useState } from "react";
import { getInventoryItems } from "../../lib/inventory"; 

export default function OrderPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Fetch all items from inventory page Firestore database
      const all = await getInventoryItems();
      // Converts items into table rows with their corresponding fields 
      const mapped = all.map((item) => {
      // Displays names that are shown on tables
      const name = String(item.item_name ?? "");
      // PP & A/C become integers, only keep numbers and never non-digits
      const pp = cleanInt(item.purchasePar); // Purchase Par (PP)
      const ac = cleanInt(item.areaCount); // Actual Count (A/C)
      // Need to order column never goes negative, stays 0 
      const need = Math.max(pp - ac, 0);
      // Returns rows from table with corresponding items and their counts
      return {
        id: item.id,
        name,
        pp,
        ac,
        need,
        unit: item.unit_of_measure || "",
      };
});


      setRows(mapped);
      setLoading(false);
    }

    load();
  }, []);
  // Called when Purchase Par is edited
  function updatePP(id, raw) {
    const pp = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pp, need: Math.max(pp - r.ac, 0) } : r))
    );
  }
  // Called when Actual Count is edited
  function updateAC(id, raw) {
    const ac = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ac, need: Math.max(r.pp - ac, 0) } : r))
    );
  }
  // Called when order form is submitted and saves list of items needed to order in a file
  function exportCsv() {
    const toExport = rows.filter((r) => r.need > 0);
    // Export as CSV won't work when there's no need to order any items
    if (toExport.length === 0) {
      alert("Nothing to order...");
      return;
    }

    const headers = ["Name", "PP", "A/C", "Need", "Unit"];
    // CSV is always valid even with special characters by wrapping them in quotes
    const escapeCell = (value) => {
      const s = String(value ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      headers.join(","),
      ...toExport.map((r) =>
        [
          escapeCell(r.name),
          escapeCell(r.pp),
          escapeCell(r.ac),
          escapeCell(r.need),
          escapeCell(r.unit),
        ].join(",")
      ),
    ];
    // Rows are converted into a single CSV string
    const csv = lines.join("\n");
    // Creates download file blob in the browser
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    // Generates file name 
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const filename = `ordering_${y}-${m}-${d}.csv`;
    // Makes temp link to the blob, clicking the anchor triggers download, and cleans up memory
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  
  // Adds up the Need to Order column across all items
  const totalNeed = useMemo(() => rows.reduce((sum, r) => sum + r.need, 0), [rows]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Ordering</h1>
        </div>

        <button
          onClick={exportCsv}
          disabled={loading || rows.length === 0}
          className="rounded-lg px-4 py-2 font-semibold bg-[#89986D] text-[#F6F0D7] hover:bg-[#7C8A5F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">
        {loading ? (
          <div className="text-gray-600">Loading items…</div>
        ) : rows.length === 0 ? (
          <div className="text-gray-500">No inventory items yet. Create items first.</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 w-24">Status</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2 w-24">Purchase Par</th>
                  <th className="text-right py-2 w-32">Actual/Count</th>
                  <th className="text-right py-2 w-32">Need to Order</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => {
                  const needsOrder = r.need > 0;
                  return (
                    <tr key={r.id} className="border-b">
                      <td className="py-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            needsOrder ? "bg-yellow-400" : "bg-green-500"
                          }`}
                        />
                      </td>

                      <td className="py-2 font-medium">{r.name}</td>

                      <td className="py-2 text-right">
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={String(r.pp)}
                          onChange={(e) => updatePP(r.id, e.target.value)}
                          className="w-20 text-right rounded border px-2 py-1 bg-white"
                        />
                      </td>

                      <td className="py-2 text-right">
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={String(r.ac)}
                          onChange={(e) => updateAC(r.id, e.target.value)}
                          className="w-20 text-right rounded border px-2 py-1 bg-white"
                        />
                      </td>

                      <td className="py-2 text-right font-semibold">{r.need}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 text-right font-semibold">Total Need: {totalNeed}</div>
          </>
        )}
      </div>
    </section>
  );
}
// Converts inputs or raw datas into safe integers for clean calculations and prevents NaN errors
function cleanInt(raw) {
  const s = String(raw ?? "").replace(/[^\d]/g, "");
  if (s === "") return 0;
  return Number(s.replace(/^0+(?=\d)/, ""));
}
