import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    // Verify the caller is authenticated and is an admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Check role in Firestore
    const callerDoc = await admin.firestore().collection("users").doc(decoded.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== "admin") {
      return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
    }

    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    await admin.auth().deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("deleteUser error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
