"use client";



import { useState, useEffect, useRef } from "react";
import { getColorTokens } from "../app/components/colorTokens";
import { useDarkMode } from "../lib/DarkModeContext";
import { getInventoryItems, updateInventoryItem } from "../lib/inventory";

export default function PrepListPage() {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [toast, setToast] = useState(null); // { type, message }
  const toastTimeout = useRef();
  // Toast helper
  function showToast(type, message) {
    setToast({ type, message });
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 2500);
  }

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [prepItems, setPrepItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prepQty, setPrepQty] = useState({}); // { id: qty }
  const [completed, setCompleted] = useState({}); // { id: true/false }


  useEffect(() => {
    async function fetchPrepItems() {
      setLoading(true);
      const items = await getInventoryItems();
      const nextPrepQty = {};
      const nextCompleted = {};
      setPrepItems(items);
      items.forEach((item, idx) => {
        const id = item.id || idx;
        const savedQty = item.prepQty ?? item.lastPrepQty ?? "";
        nextPrepQty[id] = savedQty === null || savedQty === undefined ? "" : String(savedQty);
        nextCompleted[id] = item.prepStatus === "completed";
      });
      setPrepQty(nextPrepQty);
      setCompleted(nextCompleted);
      setLoading(false);
    }
    fetchPrepItems();
    return () => clearTimeout(toastTimeout.current);
  }, [date]);

  // Summary counts
  const total = prepItems.length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const remaining = total - completedCount;

  return (
    <main className={`p-6 min-h-screen ${tokens.bg}`}>
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`text-2xl font-bold ${tokens.text}`}>Prep Lists</h1>
        <div>
          <label className="font-medium mr-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className={tokens.inputCls}
            style={{ maxWidth: 180 }}
          />
        </div>
      </header>
      <section>
        <div className={`${tokens.cardBg} rounded-3xl shadow-md p-4`}>  
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2">Item Name</th>
                <th className="py-2 px-2">Required Qty</th>
                <th className="py-2 px-2">Unit</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Prep Qty</th>
                <th className="py-2 px-2">Complete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-2 px-2 text-gray-400" colSpan={6}>Loading...</td></tr>
              ) : prepItems.length === 0 ? (
                <tr><td className="py-2 px-2 text-gray-400" colSpan={6}>No prep items yet.</td></tr>
              ) : (
                prepItems.map((item, idx) => {
                  const id = item.id || idx;
                  const qty = prepQty[id] ?? "";
                  const isCompleted = completed[id] || false;
                  const currentStock = Number(item.stock ?? item.quantity ?? 0);
                  const rawPar = item.areaCount ?? item.purchasePar ?? item.requiredQty;
                  const parTarget = rawPar === "" || rawPar === null || rawPar === undefined ? null : Number(rawPar);
                  const requiredQty = parTarget === null || Number.isNaN(parTarget)
                    ? null
                    : Math.max(parTarget - currentStock, 0);
                  const displayRequiredQty = requiredQty === null ? "-" : requiredQty;

                  async function handleCompleteChange(e) {
                    const checked = e.target.checked;
                    if (!checked) {
                      try {
                        await updateInventoryItem(id, { ...item, prepStatus: "pending" });
                        setCompleted(c => ({ ...c, [id]: false }));
                        showToast("info", "Marked as pending.");
                      } catch {
                        showToast("error", "Failed to update status.");
                      }
                      return;
                    }
                    // Validate numeric input
                    const usedQty = Number(qty);
                    if (isNaN(usedQty) || usedQty <= 0) {
                      showToast("error", "Enter a valid prep quantity.");
                      return;
                    }
                    if (requiredQty === null || usedQty !== requiredQty) {
                      showToast("error", "Prep quantity must match required quantity.");
                      return;
                    }
                    try {
                      await updateInventoryItem(id, {
                        ...item,
                        prepStatus: "completed",
                        lastPrepDate: date,
                        lastPrepQty: usedQty,
                      });
                      setCompleted(c => ({ ...c, [id]: true }));
                      showToast("success", "Prep completed.");
                    } catch (err) {
                      showToast("error", "Failed to update status.");
                    }
                  }

                  return (
                    <tr key={id} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium">{item.item_name || item.name || "-"}</td>
                      <td className="py-2 px-2">{displayRequiredQty}</td>
                      <td className="py-2 px-2">{item.inventoryUnit || item.unit_of_measure || "-"}</td>
                      <td className="py-2 px-2 capitalize">{isCompleted ? "completed" : "pending"}</td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min={0}
                          className={tokens.inputCls + " w-24"}
                          value={qty}
                          onChange={async e => {
                            const val = e.target.value;
                            if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0)) {
                              setPrepQty(q => ({ ...q, [id]: val }));
                              // If completed, revert to pending if input is changed
                              if (isCompleted) setCompleted(c => ({ ...c, [id]: false }));
                              try {
                                if (val === "") {
                                  await updateInventoryItem(id, { ...item, lastPrepQty: null, prepQty: null });
                                  setPrepItems(items => items.map(it => it.id === id ? { ...it, lastPrepQty: null, prepQty: null } : it));
                                } else {
                                  const numVal = Number(val);
                                  await updateInventoryItem(id, { ...item, lastPrepQty: numVal, prepQty: numVal });
                                  setPrepItems(items => items.map(it => it.id === id ? { ...it, lastPrepQty: numVal, prepQty: numVal } : it));
                                }
                              } catch {
                                showToast("error", "Failed to save prep quantity.");
                              }
                            }
                          }}
                          disabled={false}
                          placeholder="Qty"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={handleCompleteChange}
                          disabled={qty === "" || Number(qty) <= 0}
                          aria-label="Mark complete"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {/* Toast message (moved outside table) */}
          {toast && (
            <div
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 transition-all text-base font-semibold ${toast.type === "success" ? "bg-green-500 text-white" : toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-700 text-white"}`}
              style={{ minWidth: 220, textAlign: "center" }}
            >
              {toast.message}
            </div>
          )}
        </div>
      </section>
      <aside className="mt-8">
        <div className={`${tokens.cardBg} rounded-xl shadow-md p-4`}>
          <h2 className={`text-lg font-semibold mb-2 ${tokens.text}`}>Summary</h2>
          <div className="flex gap-8">
            <div>Total prep items: <span className="font-bold">{total}</span></div>
            <div>Completed: <span className="font-bold">{completedCount}</span></div>
            <div>Remaining: <span className="font-bold">{remaining}</span></div>
          </div>
        </div>
      </aside>
    </main>
  );
}
