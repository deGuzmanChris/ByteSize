import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "logged out" });

  response.cookies.set("session", "", {
    expires: new Date(0),
  });

  return response;
}