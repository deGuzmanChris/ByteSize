import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";

export async function verifySession() {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch (error) {
    return null;
  }
}