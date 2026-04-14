import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "@/lib/firebase";

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

function isOverloadedError(err) {
  const msg = err?.message || "";
  return msg.includes("429") || msg.includes("overloaded") || msg.includes("RESOURCE_EXHAUSTED");
}

export async function generateForecast(prompt, { maxRetries = 3, baseDelayMs = 2000 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      attempt++;
      if (isOverloadedError(err) && attempt < maxRetries) {
        const delay = baseDelayMs * 2 ** (attempt - 1); // 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
}
