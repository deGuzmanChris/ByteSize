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

      const pp = cleanInt(item.container_quantity); // PP
      const ac = cleanInt(item.unit_quantity);      // A/C

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

  function updatePP(id, raw) {
    const pp = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pp, need: Math.max(pp - r.ac, 0) } : r))
    );
  }

  function updateAC(id, raw) {
    const ac = cleanInt(raw);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ac, need: Math.max(r.pp - ac, 0) } : r))
    );
  }

  const totalNeed = useMemo(() => rows.reduce((sum, r) => sum + r.need, 0), [rows]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Ordering</h1>
          <p className="text-sm text-gray-600">
            Need to order = max(PP - A/C, 0). Green if 0, yellow if &gt; 0.
          </p>
        </div>
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
                  <th className="text-right py-2 w-24">PP</th>
                  <th className="text-right py-2 w-24">A/C</th>
                  <th className="text-right py-2 w-32">Need</th>
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
