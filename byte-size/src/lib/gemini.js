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

export async function generateForecast(prompt, { maxRetries = 2 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      attempt++;
      const { isBusy, isQuota, retryAfterSeconds } = classifyGeminiError(error);

      // Only retry transient busy errors — quota errors won't clear in seconds
      if (isBusy && !isQuota && attempt < maxRetries) {
        const delay = retryAfterSeconds ? retryAfterSeconds * 1000 + 500 : 8000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const friendlyError = new Error(
        isQuota
          ? `The AI quota is currently exhausted. Please try again${retryAfterSeconds ? ` in about ${retryAfterSeconds} seconds.` : " later."}`
          : isBusy
            ? "The AI forecast service is temporarily busy. Please try again in a minute."
            : error?.message || "Failed to generate forecast."
      );
      if (isQuota) friendlyError.code = "AI_QUOTA";
      else if (isBusy) friendlyError.code = "AI_BUSY";
      if (retryAfterSeconds) friendlyError.retryAfterSeconds = retryAfterSeconds;
      throw friendlyError;
    }
  }
}
