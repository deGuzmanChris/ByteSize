import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "@/lib/firebase";

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

function classifyGeminiError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  const retryMatch = message.match(/retry in\s+(\d+(?:\.\d+)?)s/);

  return {
    isBusy:
      message.includes("429") ||
      message.includes("overloaded") ||
      message.includes("unavailable") ||
      message.includes("fetch-error") ||
      message.includes("deadline"),
    isQuota:
      message.includes("quota exceeded") ||
      message.includes("exceeded your current quota") ||
      message.includes("billing details") ||
      message.includes("free_tier_requests") ||
      message.includes("rate-limit"),
    retryAfterSeconds: retryMatch ? Math.ceil(Number(retryMatch[1])) : null,
  };
}

export async function generateForecast(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    const { isBusy, isQuota, retryAfterSeconds } = classifyGeminiError(error);
    const friendlyError = new Error(
      isQuota
        ? `The AI quota is currently exhausted. Please try again${retryAfterSeconds ? ` in about ${retryAfterSeconds} seconds.` : " later."}`
        : isBusy
          ? "The AI forecast service is temporarily busy. Please try again in a minute."
          : error?.message || "Failed to generate forecast."
    );

    if (isQuota) {
      friendlyError.code = "AI_QUOTA";
    } else if (isBusy) {
      friendlyError.code = "AI_BUSY";
    }

    if (retryAfterSeconds) {
      friendlyError.retryAfterSeconds = retryAfterSeconds;
    }

    throw friendlyError;
  }
}
