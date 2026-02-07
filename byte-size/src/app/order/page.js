"use client";

import { useMemo, useState } from "react";

// Sprint 1: mock inventory items (this will be replaced later with DB/API)
const INVENTORY_ITEMS = [
  { id: 1, name: "Milk", unit: "L", unitCost: 4.99 },
  { id: 2, name: "Bread", unit: "loaf", unitCost: 3.49 },
  { id: 3, name: "Eggs", unit: "dozen", unitCost: 5.99 },
];

// Sprint 1: mock past orders list (this will be replaced later with backend)
const MOCK_PAST_ORDERS = [
  { id: "ORD-001", date: "2026-02-02", status: "Submitted", lines: 3, total: 42.15 },
  { id: "ORD-002", date: "2026-02-04", status: "Draft", lines: 1, total: 9.98 },
];

export default function OrderPage() {
  const [status, setStatus] = useState("Draft"); // "Draft" | "Submitted"

  // Current order lines (what the user is building)
  const [rows, setRows] = useState([
    { id: "r1", itemId: 1, qty: 0 },
  ]);

  const locked = status === "Submitted";

  const orderRows = useMemo(() => {
    return rows.map((r) => {
      const item = INVENTORY_ITEMS.find((i) => i.id === r.itemId) ?? INVENTORY_ITEMS[0];
      const qty = Number(r.qty) || 0;
      const rowTotal = qty * item.unitCost;
      return { ...r, item, qty, rowTotal };
    });
  }, [rows]);

  const totalCost = useMemo(
    () => orderRows.reduce((sum, r) => sum + r.rowTotal, 0),
    [orderRows]
  );

  function money(n) {
    return `$${n.toFixed(2)}`;
  }

  function updateRow(rowId, patch) {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: `r${Date.now()}`, itemId: INVENTORY_ITEMS[0].id, qty: 0 },
    ]);
  }

  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  }

  // Actions
  function saveDraft() {
    setStatus("Draft");
    // Later: POST to backend
    alert("Saved draft (Sprint 1 placeholder)");
  }

  function submitOrder() {
    setStatus("Submitted");
    // Later: POST to backend + lock editing
    alert("Submitted order (Sprint 1 placeholder)");
  }

  function exportCsv() {
    const headers = ["Item name", "Quantity to order", "Unit", "Unit cost", "Row total"];
    const lines = [
      headers.join(","),
      ...orderRows.map((r) =>
        [csv(r.item.name), r.qty, csv(r.item.unit), r.item.unitCost.toFixed(2), r.rowTotal.toFixed(2)].join(",")
      ),
      ["", "", "", "Total", totalCost.toFixed(2)].join(","),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = status === "Draft" ? "order-draft.csv" : "order-submitted.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Ordering</h1>
          <p className="text-sm text-gray-600">
            Create orders, save drafts, submit orders, and export CSV.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="px-3 py-2 rounded border text-sm hover:opacity-90"
        >
          Export as CSV
        </button>
      </div>

      {/* ORDER FORM (current + past orders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current + Past Orders */}
        <section className="lg:col-span-1 rounded-lg border bg-white p-4">
          <h2 className="font-semibold mb-3">Order Form</h2>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Status</div>
            <div className="flex gap-2">
              <StatusButton active={status === "Draft"} onClick={() => setStatus("Draft")}>
                Draft
              </StatusButton>
              <StatusButton active={status === "Submitted"} onClick={() => setStatus("Submitted")}>
                Submitted
              </StatusButton>
            </div>
            {locked && (
              <p className="text-xs text-gray-500 mt-2">
                Submitted orders are locked.
              </p>
            )}
          </div>

          {/* Current / Past orders list */}
          <div>
            <div className="text-sm font-medium mb-2">Current and past orders</div>
            <div className="space-y-2">
              {MOCK_PAST_ORDERS.map((o) => (
                <div key={o.id} className="rounded border p-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{o.id}</span>
                    <span className="text-gray-600">{o.status}</span>
                  </div>
                  <div className="text-gray-600">
                    {o.date} • {o.lines} lines • {money(o.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Creation View */}
        <section className="lg:col-span-2 space-y-4">
          {/* Order Table */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Order Table</h2>
              <button
                onClick={addRow}
                className="px-3 py-2 rounded bg-[#6f7f4a] text-white text-sm disabled:opacity-50"
                disabled={locked}
              >
                + Add line
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2">Item name</th>
                    <th className="py-2 pr-2 w-28">Quantity to order</th>
                    <th className="py-2 pr-2 w-24">Unit</th>
                    <th className="py-2 pr-2 w-28 text-right">Unit cost</th>
                    <th className="py-2 pr-2 w-28 text-right">Total</th>
                    <th className="py-2 w-20"></th>
                  </tr>
                </thead>

                <tbody>
                  {orderRows.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2 pr-2">
                        <select
                          value={r.itemId}
                          onChange={(e) => updateRow(r.id, { itemId: Number(e.target.value) })}
                          className="w-full rounded border px-2 py-1"
                          disabled={locked}
                        >
                          {INVENTORY_ITEMS.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          value={r.qty}
                          onChange={(e) => updateRow(r.id, { qty: Number(e.target.value) })}
                          className="w-full rounded border px-2 py-1"
                          disabled={locked}
                        />
                      </td>

                      <td className="py-2 pr-2 text-gray-700">{r.item.unit}</td>
                      <td className="py-2 pr-2 text-right">{money(r.item.unitCost)}</td>
                      <td className="py-2 pr-2 text-right font-medium">{money(r.rowTotal)}</td>

                      <td className="py-2 text-right">
                        <button
                          onClick={() => removeRow(r.id)}
                          className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                          disabled={locked}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}

                  {orderRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No order items yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary + Actions from Order Form*/}
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold mb-3">Order Summary</h2>

            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <span className="text-gray-700">Total cost</span>
              <span className="font-bold">{money(totalCost)}</span>
            </div>

            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="flex gap-2">
              <button
                onClick={saveDraft}
                className="px-4 py-2 rounded border disabled:opacity-50"
                disabled={locked}
              >
                Save draft
              </button>

              <button
                onClick={submitOrder}
                className="px-4 py-2 rounded bg-[#6f7f4a] text-white disabled:opacity-50"
                disabled={locked}
              >
                Submit order
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded text-sm border",
        active ? "bg-[#6f7f4a] text-white border-[#6f7f4a]" : "bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function csv(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}
