
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { generateForecast } from "@/lib/gemini";
import { getInventoryItems } from "@/lib/inventory";
import { getOrderHistory } from "@/lib/orderHistory";
import { useDarkMode } from "@/lib/DarkModeContext";
import { getColorTokens } from "./colorTokens";
import Modal from "./Modal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper to format markdown-like text to HTML for the detailed reasoning
function formatReasoning(text) {
  if (!text) return "";

  const blocks = text
    .replaceAll("\r", "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return "";

  return blocks
    .map((block) => {
      const cleanedBlock = block
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|\n)[\-*•]\s+/g, "$1")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ");

      return `<p class="mb-2 leading-6">${cleanedBlock}</p>`;
    })
    .join("");
}

function extractHolidays(text) {
  const match = text.match(/Upcoming Holidays:(.*?)(?:\n\n|$)/is);
  if (match) {
    return match[1]
      .split(/\n|,/)
      .map((holiday) => holiday.trim())
      .filter((holiday) => holiday.length > 0);
  }
  return [];
}

function extractReasoning(text) {
  const match = text.match(/Reasoning:(.*)/is);
  if (match) {
    return match[1].trim();
  }
  return "";
}

function extractKeyPoints(text, maxPoints = 5) {
  if (!text) return [];

  const cleaned = text
    .replaceAll("\r", "")
    .replaceAll("\n", " ")
    .trim();

  const sentenceMatches = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const points = sentenceMatches
    .map((sentence) => sentence.replace(/^[\s\-•*]+/, "").trim())
    .filter((sentence) => sentence.length > 20)
    .slice(0, maxPoints);

  return points;
}

function extractItemInsights(text, maxItems = 6) {
  if (!text) return [];

  return text
    .replaceAll("\r", "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => /^[A-Z][A-Za-z0-9 '&/-]+\s/.test(block) && block.length > 30)
    .slice(0, maxItems);
}

function normalizeChartLabel(label) {
  if (!label) return "";

  const normalized = label
    .replace(/[*]+/g, "")
    .replace(/\((?:[^)]*(?:current|stock|on[- ]hand|par|available|inventory)[^)]*)\)/gi, "")
    .replace(/\s*[-–]\s*(?:current|stock|on[- ]hand|par|available|inventory).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (/^(current|inventory|forecast|total|summary|recommended|order|quantity|qty)$/i.test(normalized)) {
    return "";
  }

  return normalized;
}

function extractChartData(text) {
  const infographicMatch = text.match(/Infographic:(.*?)(?:\n\s*Upcoming Holidays:|\n\s*Reasoning:|$)/is);
  if (!infographicMatch) return null;

  const itemMap = new Map();
  const lines = infographicMatch[1].split("\n");

  lines.forEach((line) => {
    const cleanLine = line.replace(/^[*\s]+|[*\s]+$/g, "").trim();
    if (!cleanLine) return;
    if (/^(#|Current|Inventory|Forecast|Total|Summary|\d+\sitems?)/i.test(cleanLine)) return;

    const match = cleanLine.match(/^(?:- )?(.*):\s*(\d+(?:\.\d+)?)\s*\*?$/);
    if (!match) return;

    const label = normalizeChartLabel(match[1]);
    if (!label) return;

    const quantity = Number(match[2]);
    if (!Number.isFinite(quantity) || quantity <= 0) return;

    itemMap.set(label, Math.max(itemMap.get(label) || 0, Math.floor(quantity)));
  });

  const labels = Array.from(itemMap.keys());
  if (labels.length === 0) return null;

  return {
    labels,
    datasets: [
      {
        label: "Forecasted Qty",
        data: labels.map((label) => itemMap.get(label) || 0),
        backgroundColor: "#8fa481",
      },
    ],
  };
}

function getSavedForecastState(forecast) {
  const result = forecast?.result || {};
  const rawText = result.response || result.text || forecast?.response || "";
  const chartData = (rawText ? extractChartData(rawText) : null) || result.chartData || null;
  const reasoning = result.reasoning || (rawText ? extractReasoning(rawText) : "");
  const holidays = result.holidays || (rawText ? extractHolidays(rawText) : []);

  return {
    chartData,
    holidays,
    reasoning,
    response: rawText,
  };
}

const FORECAST_FILTERS_STORAGE_KEY = "byte-size-forecast-filters";
const FORECAST_RESULT_STORAGE_KEY = "byte-size-forecast-last-result";
const MIN_REQUEST_COOLDOWN_SECONDS = 15;
const MAX_REQUEST_COOLDOWN_SECONDS = 30;
const DEFAULT_FORECAST_FILTERS = {
  timeRange: "7",
  focus: "all",
  volume: "normal",
  notes: "",
};

function normalizeForecastFilters(input = {}) {
  return {
    timeRange: String(input.timeRange || DEFAULT_FORECAST_FILTERS.timeRange),
    focus: String(input.focus || DEFAULT_FORECAST_FILTERS.focus),
    volume: String(input.volume || DEFAULT_FORECAST_FILTERS.volume),
    notes: String(input.notes || DEFAULT_FORECAST_FILTERS.notes).trim(),
  };
}

function forecastFiltersMatch(left, right) {
  const a = normalizeForecastFilters(left);
  const b = normalizeForecastFilters(right);

  return a.timeRange === b.timeRange
    && a.focus === b.focus
    && a.volume === b.volume
    && a.notes === b.notes;
}

function getForecastTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value === "object" && typeof value._seconds === "number") return value._seconds * 1000;
  if (typeof value === "object" && typeof value.seconds === "number") return value.seconds * 1000;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function isForecastCacheValid(expiresAt) {
  const timestamp = getForecastTimestamp(expiresAt);
  return timestamp === null || timestamp > Date.now();
}

function buildForecastCachePayload(forecast) {
  if (!forecast) return null;

  const savedForecast = getSavedForecastState(forecast);

  return {
    id: forecast?.id || null,
    input: normalizeForecastFilters(forecast?.input || {}),
    result: {
      chartData: savedForecast.chartData,
      holidays: savedForecast.holidays,
      reasoning: savedForecast.reasoning,
      response: savedForecast.response,
    },
    expiresAt: forecast?.expiresAt || null,
  };
}

function formatForecastDate(value) {
  if (!value) return "Unknown time";
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value.toDate === "function") return value.toDate().toLocaleString();
  if (typeof value === "object" && typeof value._seconds === "number") {
    return new Date(value._seconds * 1000).toLocaleString();
  }
  if (typeof value === "object" && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Unknown time" : parsed.toLocaleString();
}

export default function ForecasterAI() {
  const { darkMode } = useDarkMode();
  const tokens = getColorTokens(darkMode);

  const [timeRange, setTimeRange] = useState(DEFAULT_FORECAST_FILTERS.timeRange);
  const [focus, setFocus] = useState(DEFAULT_FORECAST_FILTERS.focus);
  const [volume, setVolume] = useState(DEFAULT_FORECAST_FILTERS.volume);
  const [notes, setNotes] = useState(DEFAULT_FORECAST_FILTERS.notes);
  const [response, setResponse] = useState("");
  const [chartData, setChartData] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [detailedReasoning, setDetailedReasoning] = useState("");
  const [displayMode, setDisplayMode] = useState("infographic"); // 'infographic' or 'detailed'
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestCooldown, setRequestCooldown] = useState(0);
  const [selectionAlreadyGenerated, setSelectionAlreadyGenerated] = useState(false);
  const [selectionResetAt, setSelectionResetAt] = useState(null);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedForecastId, setSelectedForecastId] = useState(null);
  const [filtersRestored, setFiltersRestored] = useState(false);

  const modalChartEntries = useMemo(() => {
    if (!chartData?.labels?.length || !chartData?.datasets?.[0]?.data?.length) return [];

    const entries = chartData.labels.map((label, idx) => ({
      label,
      value: Number(chartData.datasets[0].data[idx] ?? 0),
    }));

    entries.sort((a, b) => b.value - a.value);
    return entries;
  }, [chartData]);

  const keyPoints = useMemo(() => extractKeyPoints(detailedReasoning, 5), [detailedReasoning]);
  const itemInsights = useMemo(() => extractItemInsights(detailedReasoning, 6), [detailedReasoning]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const storedFilters = window.localStorage.getItem(FORECAST_FILTERS_STORAGE_KEY);

      if (storedFilters) {
        const parsed = JSON.parse(storedFilters);
        setTimeRange(parsed.timeRange || DEFAULT_FORECAST_FILTERS.timeRange);
        setFocus(parsed.focus || DEFAULT_FORECAST_FILTERS.focus);
        setVolume(parsed.volume || DEFAULT_FORECAST_FILTERS.volume);
        setNotes(parsed.notes || DEFAULT_FORECAST_FILTERS.notes);
      }
    } catch {
      // Ignore invalid saved filter state
    } finally {
      setFiltersRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!filtersRestored) return;

    window.localStorage.setItem(
      FORECAST_FILTERS_STORAGE_KEY,
      JSON.stringify({ timeRange, focus, volume, notes })
    );
  }, [timeRange, focus, volume, notes, filtersRestored]);

  useEffect(() => {
    if (requestCooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setRequestCooldown((current) => (current > 1 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [requestCooldown]);

  useEffect(() => {
    if (!error) return undefined;

    const timer = window.setTimeout(() => {
      setError("");
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const clearForecastView = useCallback(() => {
    setHasGenerated(false);
    setResponse("");
    setChartData(null);
    setDetailedReasoning("");
    setHolidays([]);
    setSelectedForecastId(null);
  }, []);

  const persistForecastSnapshot = useCallback((forecast) => {
    try {
      const snapshot = buildForecastCachePayload(forecast);
      if (!snapshot) return;

      window.localStorage.setItem(FORECAST_RESULT_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore local cache issues
    }
  }, []);

  const applyForecastToView = useCallback((forecast) => {
    const savedInput = forecast?.input || {};
    const savedForecast = getSavedForecastState(forecast);

    setTimeRange(savedInput.timeRange || "7");
    setFocus(savedInput.focus || "all");
    setVolume(savedInput.volume || "normal");
    setNotes(savedInput.notes || "");
    setHasGenerated(true);
    setResponse(savedForecast.response);
    setChartData(savedForecast.chartData);
    setDetailedReasoning(savedForecast.reasoning);
    setHolidays(savedForecast.holidays);
    setSelectedForecastId(forecast?.id || null);
    persistForecastSnapshot(forecast);
  }, [persistForecastSnapshot]);

  const loadSavedForecast = useCallback(async (requestedInput = null, options = {}) => {
    const params = new URLSearchParams({ userId: "anonymous" });

    if (requestedInput) {
      Object.entries(requestedInput).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }

    if (options.includeExpired) {
      params.set("includeExpired", "true");
    }

    const res = await fetch(`/api/forecast?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load saved forecast.");
    }

    if (!data.success || !data.forecast) {
      if (!options.preserveCurrent) {
        clearForecastView();
      }
      return null;
    }

    applyForecastToView(data.forecast);
    return data.forecast;
  }, [applyForecastToView, clearForecastView]);

  const checkSelectionAvailability = useCallback(async (input) => {
    try {
      const params = new URLSearchParams({
        userId: "anonymous",
        checkOnly: "true",
      });

      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });

      const res = await fetch(`/api/forecast?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check forecast availability.");
      }

      setSelectionAlreadyGenerated(Boolean(data.exists));
      setSelectionResetAt(data.resetAt || null);

      if (data.exists && data.forecast) {
        applyForecastToView(data.forecast);
      } else {
        clearForecastView();
      }
    } catch {
      setSelectionAlreadyGenerated(false);
      setSelectionResetAt(null);
      clearForecastView();
    }
  }, [applyForecastToView, clearForecastView]);

  useEffect(() => {
    if (!filtersRestored) return undefined;

    try {
      const storedForecast = window.localStorage.getItem(FORECAST_RESULT_STORAGE_KEY);

      if (storedForecast) {
        const parsedForecast = JSON.parse(storedForecast);
        const currentInput = { timeRange, focus, volume, notes };

        if (forecastFiltersMatch(parsedForecast?.input, currentInput) && isForecastCacheValid(parsedForecast?.expiresAt)) {
          applyForecastToView(parsedForecast);
          setSelectionAlreadyGenerated(true);
          setSelectionResetAt(parsedForecast?.expiresAt || null);
        }
      }
    } catch {
      // Ignore invalid cached forecast state
    }

    checkSelectionAvailability({ timeRange, focus, volume, notes });
    return undefined;
  }, [timeRange, focus, volume, notes, applyForecastToView, checkSelectionAvailability, filtersRestored]);

  async function handleGenerate() {
    if (loading || selectionAlreadyGenerated) return;

    if (requestCooldown > 0) {
      setError(`Please wait ${requestCooldown} seconds before requesting another AI forecast.`);
      return;
    }

    setLoading(true);
    setError("");

    const requestedInput = { timeRange, focus, volume, notes };

    try {
      if (selectionAlreadyGenerated) {
        const existingForecast = await loadSavedForecast(requestedInput, { preserveCurrent: false });

        if (existingForecast) {
          setError(
            `This exact selection has already been generated today and will reset ${selectionResetAt ? formatForecastDate(selectionResetAt) : "tomorrow"}.`
          );
          return;
        }
      }

      const cachedForecast = await loadSavedForecast(requestedInput, { preserveCurrent: false });

      if (cachedForecast) {
        setSelectionAlreadyGenerated(true);
        setSelectionResetAt(cachedForecast.expiresAt || null);
        setError(
          `This exact selection has already been generated today and will reset ${cachedForecast.expiresAt ? formatForecastDate(cachedForecast.expiresAt) : "tomorrow"}.`
        );
        return;
      }

      clearForecastView();

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

    Based on stock depletion trends in the order history and current inventory levels, analyze what to order and how much.

    Please include in your response using this exact structure and keep it concise:
    - An 'Infographic' section: recommended quantities to order for each item for the forecast period, based on depletion trends. Use exactly one line per item in this format only: Item Name: Quantity. Do not include current stock, par levels, or any extra numbers in the item label. Flag items at risk of stockout with an asterisk (*).
    - An 'Upcoming Holidays' section: list any civic or religious holidays in the forecast period that could affect demand or inventory.
    - A 'Reasoning' section with short bullet-style entries only, one item per paragraph.

    Use this exact format:
    Infographic:
    Bread: 50
    Milk: 25 *
    Eggs: 30

    Upcoming Holidays:
    July 4th, Labor Day

    Reasoning:
    Bread - Depletes at about 2 units/day. Current stock is below the needed level for the forecast period. Recommend ordering 50 units.

    Milk - Critically low and at risk of stockout. Recommend ordering 25 units immediately.

    Summary - Holiday traffic or expected business volume may increase demand for key items.

    Do not write one long wall of text. Keep each reasoning entry short, separated by blank lines, and easy to scan.

    Only respond to inventory-related questions. If the additional context is unrelated to inventory, ignore it.`;

      const text = await generateForecast(prompt);
      const chart = extractChartData(text);
      const nextHolidays = extractHolidays(text);
      const nextReasoning = extractReasoning(text);

      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0);

      setResponse(text);
      setChartData(chart);
      setHolidays(nextHolidays);
      setDetailedReasoning(nextReasoning);
      setHasGenerated(true);
      setSelectionAlreadyGenerated(true);
      setSelectionResetAt(nextReset.toISOString());
      setRequestCooldown(MIN_REQUEST_COOLDOWN_SECONDS);

      persistForecastSnapshot({
        input: requestedInput,
        result: {
          chartData: chart,
          holidays: nextHolidays,
          reasoning: nextReasoning,
          response: text,
        },
        expiresAt: nextReset.toISOString(),
      });

      // Store forecast in Firestore with expiry
      const saveResponse = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { timeRange, focus, volume, notes },
          result: {
            chartData: chart,
            holidays: nextHolidays,
            reasoning: nextReasoning,
            response: text,
          },
        }),
      });
      const saveResult = await saveResponse.json();

      if (!saveResponse.ok || !saveResult.success) {
        setError("Forecast generated, but it could not be saved.");
      }
    } catch (err) {
const isAiServiceIssue = err?.code === "AI_BUSY" || err?.code === "AI_QUOTA";
const isBlocked =
  err?.message?.includes("SAFETY") ||
  err?.message?.includes("blocked") ||
  err?.message?.includes("finish_reason");
const isOffline =
  err?.message?.includes("Failed to fetch") ||
  err?.message?.includes("NetworkError") ||
  err?.message?.includes("offline");

if (!isAiServiceIssue) console.error(err);

if (isAiServiceIssue) {
  const nextCooldown = err?.retryAfterSeconds || MIN_REQUEST_COOLDOWN_SECONDS;
  setRequestCooldown(
    Math.max(MIN_REQUEST_COOLDOWN_SECONDS, Math.min(nextCooldown, MAX_REQUEST_COOLDOWN_SECONDS))
  );
  setError(
    err?.code === "AI_QUOTA"
      ? err.message  // already has "retry in Xs" from classifyGeminiError
      : "The AI forecast service is temporarily busy. Please try again in a minute."
  );
} else if (isBlocked) {
  setError("The forecast request was blocked by the AI safety filter. Try adjusting your notes.");
} else if (isOffline) {
  setError("Network error — check your connection and try again.");
} else {
  setError("Failed to generate forecast. Please try again.");
}


      if (!isAiServiceIssue) {
        console.error(err);
      }

      clearForecastView();
      setSelectionAlreadyGenerated(false);
      setSelectionResetAt(null);
      setError(
        err?.code === "AI_QUOTA"
          ? "No saved forecast exists for this filter combination yet, and AI quota is currently reached."
          : err?.code === "AI_BUSY"
            ? "The AI forecast service is temporarily busy. Please try again shortly."
            : "No saved forecast exists for this filter combination yet. Generate it to see results."
      );
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

      {/* Forecast Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading || requestCooldown > 0 || selectionAlreadyGenerated}
          className="px-5 py-2 bg-[#8fa481] text-white rounded hover:bg-[#7c9170] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating..." : requestCooldown > 0 ? `Please Wait (${requestCooldown}s)` : selectionAlreadyGenerated ? "Already Generated Today" : "Generate Forecast"}
        </button>
      </div>
      {selectionAlreadyGenerated && requestCooldown === 0 && (
        <p className={`mt-2 text-xs ${tokens.text}`}>
          This exact filter combination was already generated today and unlocks {selectionResetAt ? formatForecastDate(selectionResetAt) : "tomorrow"}.
        </p>
      )}
      {requestCooldown > 0 && (
        <p className={`mt-2 text-xs ${tokens.text}`}>
          Requests are briefly limited to prevent accidental extra AI calls.
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      {/* Infographic Display */}
      {displayMode === "infographic" && hasGenerated && (
        <div className={`mt-6 p-4 rounded-xl shadow border ${darkMode ? "border-white" : "border-black"} ${tokens.cardBg} ${darkMode ? 'text-white' : ''}`}>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : tokens.text}`}>Forecast Chart</h3>
          {chartData && chartData.labels && chartData.labels.length > 0 ? (
              <>
                {isMobile ? (
                  <div className={`rounded-xl border p-3 ${darkMode ? "border-white/20 bg-white/5" : "border-black/10 bg-black/5"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${darkMode ? "text-white/50" : "text-black/40"}`}>Top Items</p>
                    <div className="flex flex-col gap-1.5 mb-3">
                      {modalChartEntries.slice(0, 2).map((entry) => {
                        const max = modalChartEntries[0]?.value || 1;
                        const pct = Math.round((entry.value / max) * 100);
                        return (
                          <div key={entry.label} className="flex items-center gap-2">
                            <span className={`w-20 text-xs truncate shrink-0 ${darkMode ? "text-white/70" : "text-black/60"}`}>{entry.label}</span>
                            <div className={`flex-1 rounded-full h-2 ${darkMode ? "bg-white/10" : "bg-black/10"}`}>
                              <div
                                className="h-2 rounded-full bg-[#8fa481]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`w-6 text-right text-xs shrink-0 ${darkMode ? "text-white/70" : "text-black/60"}`}>{entry.value}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChartModal(true)}
                      className={`w-full text-xs font-semibold py-1.5 rounded-lg border transition-colors ${darkMode ? "border-white/20 text-white/80 hover:bg-white/10" : "border-black/15 text-black/60 hover:bg-black/5"}`}
                    >
                      See all {modalChartEntries.length} items →
                    </button>
                  </div>
                ) : (
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
                            // text: "Item",
                            color: darkMode ? '#fff' : undefined,
                          },
                          ticks: {
                            color: darkMode ? '#fff' : undefined,
                            maxRotation: 0,
                            minRotation: 0,
                            callback: function(_, index) {
                              return chartData.labels[index] || '';
                            }
                          },
                          grid: {
                            color: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
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
                          grid: {
                            color: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                          },
                          beginAtZero: true
                        },
                      },
                    }}
                  />
                )}
              </>
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

      {showChartModal && chartData && chartData.labels && chartData.labels.length > 0 && (
        <Modal onClose={() => setShowChartModal(false)} title="Forecast Chart" darkMode={darkMode}>
          <div className="w-[82vw] max-w-150">
            <div
              style={{
                height: `${Math.min(Math.max(modalChartEntries.length * 36, 260), 520)}px`,
                maxHeight: "65vh",
              }}
            >
              <Bar
                data={{
                  labels: modalChartEntries.map((entry) => entry.label),
                  datasets: [
                    {
                      label: "Forecasted Qty",
                      data: modalChartEntries.map((entry) => entry.value),
                      backgroundColor: darkMode ? "#b6d094" : "#8fa481",
                      barThickness: 16,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Forecasted Qty",
                        color: darkMode ? '#fff' : undefined,
                      },
                      ticks: {
                        color: darkMode ? '#fff' : undefined,
                      },
                      grid: {
                        color: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                      },
                      beginAtZero: true,
                    },
                    y: {
                      title: {
                        display: false,
                        text: "",
                        color: darkMode ? '#fff' : undefined,
                      },
                      ticks: {
                        color: darkMode ? '#fff' : undefined,
                      },
                      grid: {
                        color: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Detailed Display */}
      {displayMode === "detailed" && hasGenerated && (
        <div className={`mt-6 p-4 rounded-xl shadow border ${darkMode ? "border-white" : "border-black"} ${tokens.forecastDetailBg} ${tokens.forecastDetailText}`}>
          <h3 className={`font-semibold mb-2 ${tokens.forecastDetailText}`}>Forecast Details</h3>

          {/* Infographic Chart (same as infographic mode) */}
          {chartData && chartData.labels && chartData.labels.length > 0 && (
            <div className="mb-2">
              <strong>Infographic:</strong>
              <table className={`min-w-50 mt-1 border text-sm w-full ${darkMode ? 'border-white' : 'border-black'}`}> 
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
          <div className={`mb-2 text-sm leading-snug ${darkMode ? "text-white" : "text-gray-700"}`}>
            <strong>Upcoming Holidays:</strong> {holidays.length > 0 ? holidays.join(", ") : "None"}
          </div>

          {/* Key Points Section */}
          <div className="text-sm mt-3">
            <strong>Top Key Points:</strong>
            {keyPoints.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {keyPoints.map((point, index) => (
                  <li key={`${index}-${point.slice(0, 24)}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">No key points available.</p>
            )}
          </div>

          {/* Item Insights Section */}
          <div className="text-sm mt-3">
            <strong>Item Insights:</strong>
            {itemInsights.length > 0 ? (
              <div className="mt-2 space-y-2">
                {itemInsights.map((insight, index) => (
                  <div
                    key={`${index}-${insight.slice(0, 24)}`}
                    className={`rounded-lg px-3 py-2 border ${darkMode ? "border-white/20 bg-white/5" : "border-black/10 bg-black/5"}`}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1">No item insights available.</p>
            )}
          </div>

          {/* Reasoning Section */}
          <div className="text-sm mt-3">
            <strong>Detailed Reasoning:</strong>
            <div
              className="mt-2 space-y-2"
              dangerouslySetInnerHTML={{ __html: formatReasoning(detailedReasoning || "No detailed reasoning provided by AI.") }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
