import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "@/lib/firebase";

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export async function generateForecast(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
