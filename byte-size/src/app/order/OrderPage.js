"use client";

import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../lib/storage";

const FALLBACK_ITEMS = [
  { id: "temp-1", name: "Milk", purchasePar: 10, actualCount: 4 },
  { id: "temp-2", name: "Bread", purchasePar: 8, actualCount: 8 },
  { id: "temp-3", name: "Eggs", purchasePar: 12, actualCount: 2 },
];

export default function OrderPage() {
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const stored = loadItems();
    setItems(stored && stored.length > 0 ? stored : FALLBACK_ITEMS);
  }, []);

  useEffect(() => {
    const initial = items.map((it) => {
      const pp = parseNonNegativeInt(it.purchasePar);
      const ac = parseNonNegativeInt(it.actualCount);
      const need = computeNeed(pp, ac);

      return {
        id: String(it.id),
        name: String(it.name ?? ""),
        pp,
        ac,
        need,
      };
    });

    setRows(initial);
  }, [items]);

  const totalNeed = useMemo(
    () => rows.reduce((sum, r) => sum + parseNonNegativeInt(r.need), 0),
    [rows]
  );

  function updatePP(id, raw) {
    const nextPP = parseNonNegativeInt(raw);

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const ac = parseNonNegativeInt(r.ac);
        const need = computeNeed(nextPP, ac);
        return { ...r, pp: nextPP, need };
      })
    );
  }

  function updateAC(id, raw) {
    const nextAC = parseNonNegativeInt(raw);

    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const pp = parseNonNegativeInt(r.pp);
        const need = computeNeed(pp, nextAC);
        return { ...r, ac: nextAC, need };
      })
    );
  }

  function exportCsv() {
    const headers = ["Status", "Name", "PP", "A/C", "Need to order"];
    const lines = [
      headers.join(","),
      ...rows.map((r) => {
        const status = statusFromDiff(r.pp, r.ac); 
        return [csv(status), csv(r.name), r.pp, r.ac, r.need].join(",");
      }),
      ["", "TOTAL", "", "", totalNeed].join(","),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "order-form.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Ordering</h1>
          <p className="text-sm text-gray-600">
            Need to order is computed as max(PP - A/C, 0). Status dot is based on PP - A/C only.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="px-4 py-2 bg-white border rounded shadow-sm hover:opacity-90 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-[#F6F0D7] rounded-xl shadow-md p-6">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/20">
                <th className="text-left py-2 pr-2 w-24">Status</th>
                <th className="text-left py-2 pr-2">Name</th>
                <th className="text-right py-2 pr-2 w-24">PP</th>
                <th className="text-right py-2 pr-2 w-24">A/C</th>
                <th className="text-right py-2 pr-2 w-32">Need to order</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => {
                const diff = Math.max(parseNonNegativeInt(r.pp) - parseNonNegativeInt(r.ac), 0);
                const needsOrdering = diff > 0; 

                return (
                  <tr key={r.id} className="border-b border-black/10">
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "inline-block w-3 h-3 rounded-full",
                            needsOrdering ? "bg-yellow-400" : "bg-green-500",
                          ].join(" ")}
                          title={needsOrdering ? "Needs ordering" : "OK"}
                        />
                        <span className="text-xs text-gray-600">
                          {needsOrdering ? "Need" : "OK"}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 pr-2 font-medium">{r.name}</td>

                    <td className="py-2 pr-2 text-right">
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={String(r.pp)}
                        onChange={(e) => updatePP(r.id, e.target.value)}
                        className="w-20 text-right rounded border px-2 py-1 bg-white"
                      />
                    </td>

                    <td className="py-2 pr-2 text-right">
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={String(r.ac)}
                        onChange={(e) => updateAC(r.id, e.target.value)}
                        className="w-20 text-right rounded border px-2 py-1 bg-white"
                      />
                    </td>

                    <td className="py-2 pr-2 text-right">
                      <input
                        value={String(r.need)}
                        readOnly
                        className="w-24 text-right rounded border px-2 py-1 bg-gray-100 text-gray-700"
                        title="Computed as max(PP - A/C, 0)"
                      />
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No items yet. Create items in Inventory first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 text-sm">
          <div className="bg-white rounded border px-4 py-2">
            <span className="text-gray-700 mr-2">Total need to order:</span>
            <span className="font-bold">{totalNeed}</span>
          </div>
        </div>
      </div>
    </section>
  );
}


function computeNeed(pp, ac) {
  return Math.max(parseNonNegativeInt(pp) - parseNonNegativeInt(ac), 0);
}

function statusFromDiff(pp, ac) {
  const diff = Math.max(parseNonNegativeInt(pp) - parseNonNegativeInt(ac), 0);
  return diff === 0 ? "OK" : "Need";
}

function parseNonNegativeInt(raw) {
  const s = String(raw ?? "").replace(/[^\d]/g, "");
  if (s === "") return 0;
  const normalized = s.replace(/^0+(?=\d)/, "");
  return Number(normalized);
}

function csv(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}
