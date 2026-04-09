"use client";

import { useState } from "react";
import React from "react";
  // Helper to format markdown-like text to HTML for the detailed reasoning
  function formatReasoning(text) {
    if (!text) return "";
    // Convert **bold**
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert numbered lists
    html = html.replace(/\n(\d+)\. /g, '<br/><span class="font-bold">$1.</span> ');
    // Convert bullets (replace asterisk with dash, including at start of string)
    html = html.replace(/(^|\n)\* /g, '$1- ');
    // Convert newlines to paragraphs (for double newlines)
    html = html.replace(/\n{2,}/g, '<br/><br/>');
    // Convert single newlines to <br/>
    html = html.replace(/\n/g, '<br/>');
    return html;
  }
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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
  const [chartData, setChartData] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [detailedReasoning, setDetailedReasoning] = useState("");
  const [displayMode, setDisplayMode] = useState("infographic"); // 'infographic' or 'detailed'
  const [hasGenerated, setHasGenerated] = useState(false);

  // Extract holidays from AI response (looks for a section like 'Upcoming Holidays: ...')
  function extractHolidays(text) {
    const match = text.match(/Upcoming Holidays:(.*?)(?:\n\n|$)/is);
    if (match) {
      return match[1]
        .split(/\n|,/)
        .map(h => h.trim())
        .filter(h => h.length > 0);
    }
    return [];
  }

  // Extract detailed reasoning from AI response (looks for a section like 'Reasoning: ...')
  function extractReasoning(text) {
    const match = text.match(/Reasoning:(.*)/is);
    if (match) {
      return match[1].trim();
    }
    return "";
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to extract chart data from forecast response (simple example: expects lines like 'Item: X, Forecast: Y')
  function extractChartData(text) {
    // Only parse the Infographic section
    const infographicMatch = text.match(/Infographic:(.*?)(?:\n\s*Upcoming Holidays:|\n\s*Reasoning:|$)/is);
    if (!infographicMatch) return null;
    const lines = infographicMatch[1].split("\n");
    const itemMap = {};
    lines.forEach((line) => {
      let cleanLine = line.replace(/^[*\s]+|[*\s]+$/g, "");
      if (!cleanLine) return;
      // Ignore section headers or summary lines
      if (/^(#|Current|Inventory|Forecast|Total|Summary|\d+\sitems?)/i.test(cleanLine)) return;
      const match = cleanLine.match(/^(?:- )?(.*?):\s*(\d+(?:\.\d+)?)/);
      if (match) {
        let cleanLabel = match[1].replace(/[*]+/g, "").trim();
        // Filter out 'Current' as a label
        if (/^current$/i.test(cleanLabel)) return;
        const qty = Number(match[2]);
        if (!isNaN(qty)) {
          if (cleanLabel in itemMap) {
            itemMap[cleanLabel] += qty;
          } else {
            itemMap[cleanLabel] = qty;
          }
        }
      }
    });
    const labels = Object.keys(itemMap);
    const data = labels.map(label => Math.floor(itemMap[label]));
    if (labels.length && data.length) {
      return {
        labels,
        datasets: [
          {
            label: "Forecasted Qty",
            data,
            backgroundColor: "#8fa481",
          },
        ],
      };
    }
    return null;
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResponse("");
    setHasGenerated(true);

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

    Please include in your response:
    - An 'Infographic' section: a simple, concise list of items and forecasted quantities for the period, suitable for a chart.
    - An 'Upcoming Holidays' section: list any civic or religious holidays in the forecast period that could affect inventory.
    - A 'Reasoning' section: detailed explanation of how the forecast was determined, including how holidays and special circumstances affect the numbers.

    Format example:
    Infographic:
    Bread: 20
    Milk: 12
    Eggs: 30

    Upcoming Holidays:
    Holiday1, Holiday2, ...

    Reasoning:
    Explain the logic and factors considered.

    Only respond to inventory-related questions. If the additional context is unrelated to inventory, ignore it.`;

      const text = await generateForecast(prompt);
      setResponse(text);
      const chart = extractChartData(text);
      setChartData(chart);
      setHolidays(extractHolidays(text));
      setDetailedReasoning(extractReasoning(text));

      // Store forecast in Firestore with expiry
      try {
        await fetch("/api/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { timeRange, focus, volume, notes },
            result: { chartData: chart, reasoning: extractReasoning(text), holidays: extractHolidays(text) },
          }),
        });
      } catch (e) {
        // Optionally handle/log error
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${tokens.secondaryBg} rounded-xl shadow-md p-6 transition-colors duration-200 mb-8`}>
      <h2 className={`text-xl font-bold mb-4 ${tokens.text}`}>AI Forecaster</h2>

      {/* Toggle for Infographic/Detailed */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${displayMode === "infographic" ? "bg-[#8fa481] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setDisplayMode("infographic")}
        >Infographic</button>
        <button
          className={`px-3 py-1 rounded ${displayMode === "detailed" ? "bg-[#8fa481] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setDisplayMode("detailed")}
        >Detailed</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Time Range */}
        <div className="flex flex-col gap-2">
          <label className={`block text-sm font-medium ${tokens.text}`}>Forecast Period</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={tokens.selectCls + " w-full"}
          >
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
          </select>
        </div>

        {/* Focus */}
        <div className="flex flex-col gap-2">
          <label className={`block text-sm font-medium ${tokens.text}`}>Focus</label>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className={tokens.selectCls + " w-full"}
          >
            <option value="all">All Items</option>
            <option value="low-stock">Low Stock Only</option>
            <option value="high-usage">High Usage Items</option>
          </select>
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-2">
          <label className={`block text-sm font-medium ${tokens.text}`}>Expected Volume</label>
          <select
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className={tokens.selectCls + " w-full"}
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
          className={tokens.inputCls + (darkMode ? " text-white" : "")}
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

      {/* Infographic Display */}
      {displayMode === "infographic" && hasGenerated && (
        <div className={`mt-6 p-4 rounded-xl shadow border ${darkMode ? "border-white" : "border-black"} ${tokens.cardBg} ${darkMode ? 'text-white' : ''}`}>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : tokens.text}`}>Forecast Chart</h3>
          {chartData && chartData.labels && chartData.labels.length > 0 ? (
              <Bar
                data={{
                  ...chartData,
                  datasets: [
                    {
                      ...chartData.datasets[0],
                      backgroundColor: darkMode ? "#b6d094" : "#8fa481",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Item",
                        color: darkMode ? '#fff' : undefined,
                      },
                      ticks: {
                        color: darkMode ? '#fff' : undefined,
                        maxRotation: 0,
                        minRotation: 0,
                        callback: function(value, index) {
                          return chartData.labels[index] || '';
                        }
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Forecasted Qty",
                        color: darkMode ? '#fff' : undefined,
                      },
                      ticks: {
                        color: darkMode ? '#fff' : undefined,
                      },
                      beginAtZero: true
                    },
                  },
                }}
              />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-50 text-gray-400">
              <span>Generating Forecast...</span>
            </div>
          )}
          {/* Show holidays below chart if any */}
          {holidays.length > 0 && (
            <div className={`mt-4 text-sm ${tokens.text}`}>
              <strong>Upcoming Holidays:</strong> {holidays.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Detailed Display */}
      {displayMode === "detailed" && hasGenerated && (
        <div className={`mt-6 p-4 rounded-xl shadow border ${darkMode ? "border-white" : "border-black"} ${tokens.forecastDetailBg} ${tokens.forecastDetailText}`}>
          <h3 className={`font-semibold mb-2 ${tokens.forecastDetailText}`}>Forecast Details</h3>

          {/* Infographic Chart (same as infographic mode) */}
          {chartData && chartData.labels && chartData.labels.length > 0 && (
            <div className="mb-4">
              <strong>Infographic:</strong>
              <table className={`min-w-50 mt-2 border text-sm w-full ${darkMode ? 'border-white' : 'border-black'}`}> 
                <thead>
                  <tr className={darkMode ? 'bg-[#222] text-white' : 'bg-gray-100 text-gray-900'}>
                    <th className={`px-2 py-1 border-b border-r text-left ${darkMode ? 'border-white' : 'border-black'}`}>Item</th>
                    <th className={`px-2 py-1 border-b text-left ${darkMode ? 'border-white' : 'border-black'}`}>Forecasted Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.labels.map((label, idx) => (
                    <tr key={label} className={darkMode ? 'bg-[#181818] text-white' : 'bg-white text-gray-900'}>
                      <td className={`px-2 py-1 border-b border-r ${darkMode ? 'border-white' : 'border-black'}`}>{label}</td>
                      <td className={`px-2 py-1 border-b ${darkMode ? 'border-white' : 'border-black'}`}>{chartData.datasets[0].data[idx]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Holidays Section */}
          <div className={`mb-2 text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>
            <strong>Upcoming Holidays:</strong> {holidays.length > 0 ? holidays.join(", ") : "None"}
          </div>

          {/* Reasoning Section */}
          <div className="text-sm mt-2">
            <strong>Reasoning:</strong>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: formatReasoning(detailedReasoning || "No detailed reasoning provided by AI.") }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
