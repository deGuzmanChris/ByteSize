"use client";

import { useState, useEffect, useMemo } from "react";
import { getOrderHistory } from "../../lib/orderHistory";
import { useDarkMode } from "../../lib/DarkModeContext";

const TIMELINES = [
  { label: "Week", days: 7 },
  { label: "Month", days: 30 },
  { label: "Year", days: 365 },
];

function sinceDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default function ReportsPage() {
  const { darkMode } = useDarkMode();
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dark mode color tokens
  const text = darkMode ? "text-[#f0f0f0]" : "text-black";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const cardBg = darkMode ? "bg-[#2d2d2d]" : "bg-white";
  const innerCard = darkMode ? "bg-[#3a3a3a]" : "bg-[#F6F0D7]";
  const borderCls = darkMode ? "border-[#444]" : "border-gray-200";
  const tabActive = darkMode ? "bg-[#4a5c38] text-[#f0f0f0]" : "bg-[#89986D] text-white";
  const tabInactive = darkMode
    ? "bg-[#3a3a3a] text-gray-400 hover:bg-[#444]"
    : "bg-[#F6F0D7] text-gray-600 hover:bg-[#e5dab6]";
  const barBg = darkMode ? "bg-[#4a4a4a]" : "bg-[#e5dab6]";
  const barFill = "bg-[#89986D]";

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getOrderHistory(sinceDate(timeline.days));
      setOrders(data);
      setLoading(false);
    }
    load();
  }, [timeline]);

  // Aggregate item totals across all orders in the selected period
  const itemTotals = useMemo(() => {
    const map = {};
    for (const order of orders) {
      for (const item of order.items ?? []) {
        if (!map[item.name]) {
          map[item.name] = { name: item.name, unit: item.unit, total: 0, appearances: 0 };
        }
        map[item.name].total += item.need;
        map[item.name].appearances += 1;
      }
    }
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [orders]);

  // Group orders by date bucket for frequency trend
  const frequencyData = useMemo(() => {
    if (orders.length === 0) return [];
    const buckets = {};
    const fmt = (dateStr) => {
      const d = new Date(dateStr);
      if (timeline.days <= 30) {
        return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
      }
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    for (const order of orders) {
      const key = fmt(order.date);
      buckets[key] = (buckets[key] || 0) + 1;
    }
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count }));
  }, [orders, timeline]);

  const totalOrdersPlaced = orders.length;
  const totalItemsOrdered = orders.reduce((sum, o) => sum + (o.totalQuantity ?? 0), 0);
  const topItem = itemTotals[0] ?? null;
  const maxItemTotal = itemTotals[0]?.total ?? 1;
  const maxFreq = Math.max(...frequencyData.map((b) => b.count), 1);

  return (
    <div className={`${text} transition-colors duration-200`}>
      {/* Header + timeline selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          {TIMELINES.map((t) => (
            <button
              key={t.label}
              onClick={() => setTimeline(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                timeline.label === t.label ? tabActive : tabInactive
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={muted}>Loading analytics…</div>
      ) : orders.length === 0 ? (
        <div className={`${innerCard} rounded-xl p-8 text-center ${muted} transition-colors duration-200`}>
          <p className="text-lg font-medium mb-1">No orders recorded yet</p>
          <p className="text-sm">
            Export your first order from the Ordering page to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard cardBg={cardBg} label="Orders Placed" value={totalOrdersPlaced} />
            <SummaryCard cardBg={cardBg} label="Total Units Ordered" value={totalItemsOrdered} />
            <SummaryCard
              cardBg={cardBg}
              label="Most Ordered Item"
              value={topItem ? topItem.name : "—"}
              sub={topItem ? `${topItem.total} ${topItem.unit} total` : ""}
            />
          </div>

          {/* Top items bar chart */}
          <div className={`${cardBg} rounded-xl shadow p-6 transition-colors duration-200`}>
            <h2 className="text-lg font-semibold mb-4">Top Items by Quantity Ordered</h2>
            <div className="space-y-3">
              {itemTotals.slice(0, 8).map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium truncate">{item.name}</span>
                    <span className={`ml-4 shrink-0 ${muted}`}>
                      {item.total} {item.unit}
                    </span>
                  </div>
                  <div className={`w-full h-3 rounded-full ${barBg}`}>
                    <div
                      className={`h-3 rounded-full ${barFill} transition-all duration-500`}
                      style={{ width: `${Math.round((item.total / maxItemTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order frequency chart */}
          <div className={`${cardBg} rounded-xl shadow p-6 transition-colors duration-200`}>
            <h2 className="text-lg font-semibold mb-4">Order Frequency</h2>
            <div className="flex items-end gap-2 h-36 overflow-x-auto pb-2">
              {frequencyData.map(({ label, count }) => {
                const dateLabel =
                  timeline.days <= 30
                    ? new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : new Date(label + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
                return (
                  <div key={label} className="flex flex-col items-center flex-1 min-w-10">
                    <span className={`text-xs mb-1 ${muted}`}>{count}</span>
                    <div
                      className={`w-full rounded-t ${barFill} transition-all duration-500`}
                      style={{ height: `${Math.max(Math.round((count / maxFreq) * 96), 4)}px` }}
                    />
                    <span className={`text-xs mt-1 ${muted} truncate w-full text-center`}>
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent orders log */}
          <div className={`${cardBg} rounded-xl shadow p-6 transition-colors duration-200`}>
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${borderCls}`}>
                    <th className="text-left py-2 pr-4 font-semibold">Date</th>
                    <th className="text-left py-2 pr-4 font-semibold">Items Ordered</th>
                    <th className="text-right py-2 font-semibold">Total Units</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className={`border-b ${borderCls}`}>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className={`py-2 pr-4 ${muted} text-xs`}>
                        {(order.items ?? []).map((i) => i.name).join(", ")}
                      </td>
                      <td className="py-2 text-right font-semibold">{order.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ cardBg, label, value, sub }) {
  return (
    <div className={`${cardBg} rounded-xl shadow p-5 transition-colors duration-200`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold truncate">{value}</p>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}
