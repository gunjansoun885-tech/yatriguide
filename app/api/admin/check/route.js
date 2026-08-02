import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "yatriguide_admin_session";
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "yatriguide-super-secure-admin-secret-2026";

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  try {
    const [base64Payload, signature] = token.split(".");
    const expectedSignature = createHmac("sha256", SECRET_KEY).update(base64Payload).digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  const session = verifySessionToken(sessionCookie?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { email: session.email, role: "admin" },
  });
}
