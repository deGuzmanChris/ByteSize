"use client";

import { useEffect, useMemo, useState } from "react";
import { getInventoryItems } from "../../lib/inventory"; 

export default function OrderPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const all = await getInventoryItems();

      const mapped = all.map((item) => {
        const name = String(item.item_name ?? "");

        // Optional: clamp initial values too (safe)
        const pp = clamp(cleanInt(item.purchasePar), 0, MAX_PP);
        const ac = clamp(cleanInt(item.areaCount), 0, MAX_AC);

        const need = Math.max(pp - ac, 0);

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
    const digitsOnly = String(raw ?? "").replace(/[^\d]/g, "");

    if (digitsOnly.length > 3) return;

    const pp = digitsOnly === "" ? 0 : Number(digitsOnly.replace(/^0+(?=\d)/, ""));

    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, pp, need: Math.max(pp - r.ac, 0) } : r
      )
    );
  }

  // Called when Actual Count is edited 
  function updateAC(id, raw) {
    const digitsOnly = String(raw ?? "").replace(/[^\d]/g, "");

    if (digitsOnly.length > 3) return;

    const ac = digitsOnly === "" ? 0 : Number(digitsOnly.replace(/^0+(?=\d)/, ""));

    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ac, need: Math.max(r.pp - ac, 0) } : r
      )
    );
  }

  function exportCsv() {
    const toExport = rows.filter((r) => r.need > 0);
    if (toExport.length === 0) {
      alert("Nothing to order...");
      return;
    }

    const headers = ["Name", "PP", "A/C", "Need", "Unit"];
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

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const filename = `ordering_${y}-${m}-${d}.csv`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

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

function cleanInt(raw) {
  const s = String(raw ?? "").replace(/[^\d]/g, "");
  if (s === "") return 0;
  return Number(s.replace(/^0+(?=\d)/, ""));
}