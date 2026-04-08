import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import getAdmin from "@/lib/firebaseAdmin";

// POST /api/forecast
export async function POST(req) {
  const admin = getAdmin(); // Ensure admin is initialized
  const db = admin.firestore();
  const auth = admin.auth();

  try {
    const { input, result } = await req.json();
    // Optionally, get user from session/cookie if needed
    // const user = await auth.verifyIdToken(token);
    // const userId = user.uid;
    const userId = input.userId || "anonymous";
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Use a composite key: userId + JSON.stringify(input) as a unique forecast
    const inputKey = JSON.stringify({ userId, ...input });
    const forecastsRef = db.collection("forecasts");
    const existing = await forecastsRef
      .where("userId", "==", userId)
      .where("input", "==", input)
      .get();

    if (!existing.empty) {
      // Replace the existing forecast
      const docRef = existing.docs[0].ref;
      await docRef.set({
        userId,
        input,
        result,
        createdAt: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
      });
    } else {
      // Create a new forecast
      await forecastsRef.add({
        userId,
        input,
        result,
        createdAt: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
