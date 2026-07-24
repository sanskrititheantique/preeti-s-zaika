import { NextResponse } from "next/server";
import {
  createSessionCookieValue,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/adminAuth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;

  const correctUsername = process.env.ADMIN_USERNAME || "admin";
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    return NextResponse.json(
      { error: "Server is missing ADMIN_PASSWORD configuration." },
      { status: 500 }
    );
  }

  if (username !== correctUsername || password !== correctPassword) {
    return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
  }

  const cookieValue = createSessionCookieValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
