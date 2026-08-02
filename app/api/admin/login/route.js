import { createHmac } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "yatriguide_admin_session";
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "yatriguide-super-secure-admin-secret-2026";

function generateSessionToken(email) {
  const payload = JSON.stringify({
    email,
    role: "admin",
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = createHmac("sha256", SECRET_KEY).update(base64Payload).digest("base64url");
  return `${base64Payload}.${signature}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();
    const password = body.password?.trim();

    const expectedEmail = (process.env.ADMIN_EMAIL || "admin@yatriguide.in").trim().toLowerCase();
    const expectedPassword = (process.env.ADMIN_PASSWORD || "Admin@12345").trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid admin email or password." }, { status: 401 });
    }

    const token = generateSessionToken(email);

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful.",
      user: { email, role: "admin" },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Unable to process login right now." }, { status: 500 });
  }
}
