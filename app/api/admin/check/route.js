import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  const session = verifySessionToken(sessionCookie?.value);

  if (!session) {
    return NextResponse.json({ authenticated: false, error: "Unauthorized access." }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role || "admin",
    },
  });
}
