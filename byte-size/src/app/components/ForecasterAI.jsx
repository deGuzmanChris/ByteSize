"use client";

import { useState } from "react";
import { generateForecast } from "@/lib/gemini";
import { getInventoryItems } from "@/lib/inventory";
import { getOrderHistory } from "@/lib/orderHistory";
import { useDarkMode } from "@/lib/DarkModeContext";
import { getColorTokens } from "./colorTokens";

export default function ForecasterAI() {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [timeRange, setTimeRange] = useState("7");
  const [focus, setFocus] = useState("all");
  const [volume, setVolume] = useState("normal");
  const [notes, setNotes] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      // Fetch data from Firebase
      const items = await getInventoryItems();
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 90);
      const orders = await getOrderHistory(sinceDate.toISOString());

      // Build inventory summary
      const inventorySummary = items.map((item) => ({
        name: item.item_name,
        currentCount: item.areaCount ?? 0,
        parLevel: item.purchasePar ?? 0,
        unit: item.inventoryUnit || "",
      }));

      // Build order history summary
      const orderSummary = orders.map((order) => ({
        date: order.date,
        items: order.items,
        totalQuantity: order.totalQuantity,
      }));

      const prompt = `You are an inventory forecasting assistant for a food service business.

Here is the current inventory:
${JSON.stringify(inventorySummary, null, 2)}

Here is the order history for the last 90 days:
${JSON.stringify(orderSummary, null, 2)}

The user wants a forecast for the next ${timeRange} days.
Expected volume: ${volume}
Focus: ${focus === "all" ? "all items" : focus}
Additional context from user: ${notes || "none"}

Based on the stock depletion trends in the order history and current inventory levels:
1. Recommend what to order and how much.
2. Flag any items trending toward running out before the forecast period ends.
3. Keep the response concise and actionable.

Only respond to inventory-related questions. If the additional context is unrelated to inventory, ignore it.`;

      const text = await generateForecast(prompt);
      setResponse(text);
    } catch (err) {
      console.error(err);
      setError("Failed to generate forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${tokens.secondaryBg} rounded-xl shadow-md p-6 transition-colors duration-200`}>
      <h2 className={`text-xl font-bold mb-4 ${tokens.text}`}>AI Forecaster</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Time Range */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${tokens.text}`}>
            Forecast Period
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={tokens.selectCls}
          >
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
          </select>
        </div>

        {/* Focus */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${tokens.text}`}>
            Focus
          </label>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className={tokens.selectCls}
          >
            <option value="all">All Items</option>
            <option value="low-stock">Low Stock Only</option>
            <option value="high-usage">High Usage Items</option>
          </select>
        </div>

        {/* Volume */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${tokens.text}`}>
            Expected Volume
          </label>
          <select
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className={tokens.selectCls}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="busy">Busy</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${tokens.text}`}>
          Special Circumstances
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Catering event on Saturday, holiday weekend coming up..."
          className={tokens.inputCls}
          rows={2}
          maxLength={300}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-5 py-2 bg-[#8fa481] text-white rounded hover:bg-[#7c9170] disabled:opacity-50 transition-colors"
      >
        {loading ? "Generating..." : "Generate Forecast"}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      {/* Response */}
      {response && (
        <div className={`mt-6 p-4 rounded-lg ${tokens.cardBg} ${tokens.text}`}>
          <h3 className="font-semibold mb-2">Forecast</h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
