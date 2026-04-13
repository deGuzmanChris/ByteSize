"use client";

import { useEffect, useMemo, useState } from "react";
import { getInventoryItems, updateInventoryItem } from "../../lib/inventory";
import { useDarkMode } from "../../lib/DarkModeContext";
import { getColorTokens } from "../components/colorTokens";
import ExportOrderForm from "../components/ExportOrderForm.jsx";

export default function OrderPage() {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);
  const text = tokens.text;
  const cardBg = tokens.secondaryBg;
  const borderCls = darkMode ? "border-b border-white" : "border-b";
  const inputCls = darkMode
    ? "w-20 text-right rounded border px-2 py-1 bg-[#4a4a4a] text-[#f0f0f0] border-[#555]"
    : "w-20 text-right rounded border px-2 py-1 bg-white";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await getInventoryItems();
      const mapped = all.map((item) => {
        const name = String(item.item_name ?? "");
        const pp = cleanInt(item.purchasePar);
        const ac = cleanInt(item.areaCount);
        const need = Math.max(pp - ac, 0);
        return { id: item.id, name, pp, ac, need, unit: item.inventoryUnit || "" };
      });
      setRows(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const updatePP = async (id, raw) => {
    const pp = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pp, need: Math.max(pp - r.ac, 0) } : r))
    );
    await updateInventoryItem(id, { purchasePar: pp });
  };

  const updateAC = async (id, raw) => {
    const ac = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ac, need: Math.max(r.pp - ac, 0) } : r))
    );
    await updateInventoryItem(id, { areaCount: ac });
  };

  const sortedRows = [...rows].sort((a, b) => b.need - a.need);
  const totalNeed = useMemo(() => rows.reduce((sum, r) => sum + r.need, 0), [rows]);

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-2">
        <h1 className={`text-2xl font-bold ${text}`}>Ordering</h1>
        <ExportOrderForm rows={rows} notes={notes} disabled={loading || rows.length === 0} darkMode={darkMode} />
      </div>

      {/* Notes */}
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={`w-full mb-4 p-2 rounded border ${text}`}
        maxLength={800}
      />

      {/* Inventory Table */}
      <div className={`${cardBg} rounded-xl shadow-md p-6 transition-colors duration-200`}>
        {loading ? (
          <div className={mutedText}>Loading items…</div>
        ) : rows.length === 0 ? (
          <div className={mutedText}>No inventory items yet. Create items first.</div>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {sortedRows.map((r) => {
                const needsOrder = r.need > 0;

                return (
                  <div
                    key={r.id}
                    className={`rounded-lg border p-3 ${darkMode ? "border-[#555] bg-[#4a4a4a]/30" : "border-[#d6d0b8] bg-white/40"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${needsOrder ? "bg-yellow-400" : "bg-green-500"}`}
                          />
                          <span className="font-medium truncate">{r.name}</span>
                        </div>
                        <div className={`mt-1 text-xs ${mutedText}`}>Unit: {r.unit || "-"}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs ${mutedText}`}>Need</div>
                        <div className={`font-semibold ${needsOrder ? "text-yellow-600 dark:text-yellow-600" : ""}`}>
                          {r.need}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className={`text-xs ${mutedText}`}>
                        Par
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={String(r.pp)}
                          onChange={(e) => updatePP(r.id, e.target.value)}
                          className={`${inputCls} mt-1 w-full`}
                        />
                      </label>
                      <label className={`text-xs ${mutedText}`}>
                        Count
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={String(r.ac)}
                          onChange={(e) => updateAC(r.id, e.target.value)}
                          className={`${inputCls} mt-1 w-full`}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className={`w-full text-sm ${text}`}>
                <thead>
                  <tr className={borderCls}>
                    <th className="text-left py-3 px-3 w-24">Status</th>
                    <th className="text-left py-3 px-3">Name</th>
                    <th className="text-left py-3 px-3 w-20">Unit</th>
                    <th className="text-right py-3 px-3 w-24">Par</th>
                    <th className="text-right py-3 px-3 w-32">Count</th>
                    <th className="text-right py-3 px-3 w-32">Need to Order</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedRows.map((r, idx) => {
                    const needsOrder = r.need > 0;
                    const zebra = idx % 2 === 0 ? "bg-white/20 dark:bg-gray-500/30" : "";

                    return (
                      <tr
                        key={r.id}
                        className={`${borderCls} ${zebra} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center">
                            <span
                              className={`inline-block w-3 h-3 rounded-full ${needsOrder ? "bg-yellow-400" : "bg-green-500"}`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium">{r.name}</td>
                        <td className="py-3 px-3">{r.unit}</td>
                        <td className="py-3 px-3 text-right">
                          <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={String(r.pp)}
                            onChange={(e) => updatePP(r.id, e.target.value)}
                            className={`${inputCls} ml-auto`}
                          />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={String(r.ac)}
                            onChange={(e) => updateAC(r.id, e.target.value)}
                            className={`${inputCls} ml-auto`}
                          />
                        </td>
                        <td className="py-3 px-3 text-right font-semibold">
                          <span className={needsOrder ? "text-yellow-600 dark:text-yellow-600" : ""}>
                            {r.need}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={`mt-4 text-right font-semibold ${text} pr-3`}>
              Total Need: {totalNeed}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function cleanInt(raw) {
  const s = String(raw ?? "").replace(/[^\d]/g, "").slice(0, 2);
  return s === "" ? 0 : Number(s.replace(/^0+(?=\d)/, ""));
}