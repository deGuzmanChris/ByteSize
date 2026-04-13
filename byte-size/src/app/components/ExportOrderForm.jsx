"use client";

import { logOrder } from "../../lib/orderHistory";

export default function ExportOrderForm({ rows, notes, disabled, darkMode }) {
  const exportCsv = async () => {
    const toExport = rows.filter((r) => r.need > 0);

    if (toExport.length === 0) {
      alert("Nothing to order...");
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString();

    const escapeCell = (value) => {
      const s = String(value ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      ["ORDER SHEET"].join(","),
      [`Date: ${dateStr}`],
      [""],
      ["Notes:"],
      [escapeCell(notes || "None")],
      [""],
      ["Item", "Unit", "Needed Quantity"],
      ...toExport.map((r) =>
        [escapeCell(r.name), escapeCell(r.unit), escapeCell(r.need)].join(",")
      ),
    ];

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = `order_${today.toISOString().split("T")[0]}.csv`;
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    await logOrder({
      items: toExport,
      notes,
      createdAt: new Date(),
    });
  };

  return (
    <button
      onClick={exportCsv}
      disabled={disabled}
      className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap shadow transition-colors sm:min-h-0 sm:px-4 sm:text-base ${
        darkMode
          ? "bg-[#8fa481] text-white hover:bg-[#7a926e]"
          : "bg-[#8fa481] text-black hover:bg-[#7a926e]"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      Generate Order Sheet
    </button>
  );
}