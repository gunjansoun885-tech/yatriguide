import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "yatriguide_admin_session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logged out successfully.",
  });

  response.cookies.delete(COOKIE_NAME);
  return response;
}
