import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
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
