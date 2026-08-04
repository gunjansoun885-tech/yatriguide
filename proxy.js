import { NextResponse } from "next/server";

const COOKIE_NAME = "yatriguide_admin_session";
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "yatriguide-super-secure-admin-secret-2026-v2-prod";

/**
 * Web Crypto API HMAC SHA-256 verification compatible with Next.js Proxy Edge & Node runtimes.
 */
async function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  try {
    const [base64Payload, signature] = token.split(".");

    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET_KEY);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(base64Payload)
    );

    const bytes = new Uint8Array(sigBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const expectedSignature = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (signature !== expectedSignature) return null;

    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch (err) {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin page routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = await verifyToken(token);

    // Redirect unauthenticated users accessing /admin to /admin/login
    if (!session && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users trying to access /admin/login back to dashboard
    if (session && isLoginPage) {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Protect all /api/admin API endpoints (except /api/admin/login)
  if (pathname.startsWith("/api/admin")) {
    const isLoginApi = pathname === "/api/admin/login";
    if (!isLoginApi) {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      const session = await verifyToken(token);
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized admin access. Authentication required." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
