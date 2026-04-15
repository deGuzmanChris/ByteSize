import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import getAdmin from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeForecastInput(input = {}) {
  return {
    focus: input.focus || "all",
    notes: input.notes || "",
    timeRange: input.timeRange || "7",
    volume: input.volume || "normal",
  };
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDayKey(value = new Date()) {
  const date = toDate(value);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextDailyReset(now = new Date()) {
  const resetAt = new Date(now);
  resetAt.setHours(24, 0, 0, 0);
  return resetAt;
}

function isForecastExpired(forecast, now) {
  const currentDayKey = getDayKey(now);
  const forecastDayKey = forecast.dayKey || getDayKey(forecast.createdAt);

  if (forecastDayKey && currentDayKey && forecastDayKey !== currentDayKey) {
    return true;
  }

  const expiresAt = toDate(forecast.expiresAt);
  if (!expiresAt) return false;
  return expiresAt.getTime() <= now.getTime();
}

function matchesInputFilters(forecast, userId, input) {
  const normalizedInput = normalizeForecastInput(input);
  const forecastInput = normalizeForecastInput(forecast.input);
  const expectedInputKey = JSON.stringify({ userId, ...normalizedInput });

  if (forecast.inputKey) {
    return forecast.inputKey === expectedInputKey;
  }

  return JSON.stringify(forecastInput) === JSON.stringify(normalizedInput);
}

function jsonNoStore(body, init) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

// POST /api/forecast
export async function POST(req) {
  const admin = getAdmin(); // Ensure admin is initialized
  const db = admin.firestore();

  try {
    const { input, result } = await req.json();
    // Optionally, get user from session/cookie if needed
    // const user = await auth.verifyIdToken(token);
    // const userId = user.uid;
    const userId = input.userId || "anonymous";
    const now = new Date();
    const expiresAt = getNextDailyReset(now);
    const dayKey = getDayKey(now);

    // Enforce consistent key order for inputKey
    const orderedInput = normalizeForecastInput(input);
    const inputKey = JSON.stringify({ userId, ...orderedInput });
    const forecastsRef = db.collection("forecasts");
    const docRef = await forecastsRef.add({
      userId,
      input: orderedInput,
      inputKey,
      dayKey,
      result,
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
    });

    return jsonNoStore({ success: true, id: docRef.id });
  } catch (err) {
    return jsonNoStore({ success: false, error: err.message }, { status: 500 });
  }
}

// GET /api/forecast
export async function GET(req) {
  const admin = getAdmin();
  const db = admin.firestore();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous";
    const includeExpired = searchParams.get("includeExpired") === "true";
    const checkOnly = searchParams.get("checkOnly") === "true";
    const forecastsRef = db.collection("forecasts");
    const now = new Date();
    const hasInputFilters = ["timeRange", "focus", "volume", "notes"].some((key) =>
      searchParams.has(key)
    );

    const snapshot = await forecastsRef.where("userId", "==", userId).get();
    if (snapshot.empty) {
      if (checkOnly) {
        return jsonNoStore({ success: true, exists: false, forecast: null, resetAt: null });
      }

      return jsonNoStore({ success: false, forecast: null });
    }

    const requestedInput = hasInputFilters
      ? {
          focus: searchParams.get("focus"),
          notes: searchParams.get("notes"),
          timeRange: searchParams.get("timeRange"),
          volume: searchParams.get("volume"),
        }
      : null;

    const matchingForecasts = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((forecast) => {
        if (!requestedInput) return true;
        return matchesInputFilters(forecast, userId, requestedInput);
      })
      .sort((left, right) => {
        const rightCreatedAt = toDate(right.createdAt)?.getTime() || 0;
        const leftCreatedAt = toDate(left.createdAt)?.getTime() || 0;
        return rightCreatedAt - leftCreatedAt;
      });

    const activeForecast = matchingForecasts.find((forecast) => !isForecastExpired(forecast, now));

    if (checkOnly) {
      return jsonNoStore({
        success: true,
        exists: Boolean(activeForecast),
        forecast: activeForecast || null,
        resetAt: activeForecast?.expiresAt || null,
      });
    }
    const latestForecast = matchingForecasts[0] || null;
    const selectedForecast = activeForecast || (includeExpired ? latestForecast : null);

    if (!selectedForecast) {
      return jsonNoStore({ success: false, forecast: null });
    }

    return jsonNoStore({
      success: true,
      forecast: selectedForecast,
      stale: !activeForecast && Boolean(latestForecast),
    });
  } catch (err) {
    return jsonNoStore({ success: false, error: err.message }, { status: 500 });
  }
}
